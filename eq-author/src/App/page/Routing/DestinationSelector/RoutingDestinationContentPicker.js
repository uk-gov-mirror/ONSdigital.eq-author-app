import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { Query } from "react-apollo";

import ContentPickerSelect from "components/ContentPickerSelect";
import { DESTINATION } from "components/ContentPickerSelect/content-types";

import getAvailableRoutingDestinations from "./getAvailableRoutingDestinations.graphql";

const getLogical = (logical, loading, availableRoutingDestinations) => {
  if (loading) {
    return {
      title: "Loading...",
    };
  }

  if (logical === "EndOfQuestionnaire") {
    return {
      title: "End of questionnaire",
    };
  }

  if (availableRoutingDestinations.pages.length) {
    if (logical === "NextPage") {
      return {
        title: "Next page",
        subTitle: availableRoutingDestinations.pages[0].displayName,
      };
    } else {
      return {
        title: availableRoutingDestinations.pages[0].displayName,
      };
    }
  }
  if (availableRoutingDestinations.sections.length) {
    return {
      title: availableRoutingDestinations.sections[0].displayName,
    };
  }
  return {
    title: "End of questionnaire",
  };
};

const getAbsolute = selected => {
  const absolute = selected.section || selected.page;
  return { title: absolute.displayName };
};

const getSelected = (selected, loading, availableRoutingDestinations) => {
  if (selected.logical) {
    return getLogical(selected.logical, loading, availableRoutingDestinations);
  }
  return getAbsolute(selected);
};

export const UnwrappedRoutingDestinationContentPicker = ({
  data,
  loading,
  selected,
  ...otherProps
}) => {
  const destinationData = get(data, "page.availableRoutingDestinations");
  return (
    <ContentPickerSelect
      name="routingDestination"
      contentTypes={[DESTINATION]}
      destinationData={destinationData}
      selectedContent={getSelected(selected, loading, destinationData)}
      selectedObj={selected || undefined}
      {...otherProps}
    />
  );
};

UnwrappedRoutingDestinationContentPicker.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    page: PropTypes.shape({
      availableRoutingDestinations: PropTypes.shape({
        logicalDestinations: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            logicalDestination: PropTypes.string.isRequired,
          })
        ),
        questionPages: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
          })
        ),
        sections: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
          })
        ),
      }),
    }),
  }),
  selected: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const RoutingDestinationContentPicker = props => (
  <Query
    query={getAvailableRoutingDestinations}
    variables={{ input: { pageId: props.pageId } }}
    fetchPolicy="cache-and-network"
  >
    {innerProps => (
      <UnwrappedRoutingDestinationContentPicker {...innerProps} {...props} />
    )}
  </Query>
);

RoutingDestinationContentPicker.propTypes = {
  pageId: PropTypes.string.isRequired,
};

export default RoutingDestinationContentPicker;
