import { capitalize } from "lodash";

const users = [
  {
    email: "ross.shepherd@ons.gov.uk",
    id: "0JHzy5ojxGYH2IvrwwxHMQ91d0J2",
  },
  {
    email: "usman.khan@ons.gov.uk",
    id: "0R1mAT7j0JPMuCzRARyorjr3YEE2",
  },
  {
    email: "megan.pryor@ons.gov.uk",
    id: "11FDzxWpfBNjn4l4kLgb5n5MoEn1",
  },
  {
    email: "alison.hawkesworth@ons.gov.uk",
    id: "312zjcp79vgU4bANiVuAzXLXW2a2",
  },
  {
    email: "colin.beavan-seymour@ons.gov.uk",
    id: "3rjMolqHXiPCh3i9LN6GKnJtmHx1",
  },
  {
    email: "hazel.clarke@ons.gov.uk",
    id: "59vpV4AKHWagXzvXjjTui2O5JAp2",
  },
  {
    email: "leanne.cook@ons.gov.uk",
    id: "6JbNF8RPH7ezMdvTqvQ1uPScUx93",
  },
  {
    email: "beverley.best@ons.gov.uk",
    id: "7AAAzoL41GWlw1VvQu41wpfCC1N2",
  },
  {
    email: "steve.john@ons.gov.uk",
    id: "8KURZiYhOddXc6Np5eA0AwOe25o1",
  },
  {
    email: "andrew.maddaford@ons.gov.uk",
    id: "8ocoAZ0hpWeioxWnghrB8fzXlrm2",
  },
  {
    email: "adam.dwyer@ons.gov.uk",
    id: "9AUkSHWDHSZyPGt1e6XWIl8Zwbv2",
  },
  {
    email: "jordan.stewart@ons.gov.uk",
    id: "AEMRmtQhF1dEYOXqSPHMOyGkGt82",
  },
  {
    email: "richard.smale@ons.gov.uk",
    id: "AU29wf4jjBdzMJRBoxiEqgIoTLr2",
  },
  {
    email: "alex.nolan@ons.gov.uk",
    id: "B2rJE6KiOQX5CG4C2Cwfzd7mZd42",
  },
  {
    email: "sam.godwin@ext.ons.gov.uk",
    id: "BUtVQfQYQFPynkgKCUCXwIQuYiC2",
  },
  {
    email: "curtis.cody@ons.gov.uk",
    id: "BlCpJc6dQXUbvfhNBrQBWkzA8H93",
  },
  {
    email: "samiwel.thomas@ons.gov.uk",
    id: "By23TRaSdkZaSxa0qDtmXQIOSHG2",
  },
  {
    email: "daisy.hamer@ons.gov.uk",
    id: "CTviwkhQceR0VdAifsi1wEUghA83",
  },
  {
    email: "charlotte.hirst@ons.gov.uk",
    id: "CbenKrQD5jXhGsckB4jQHtG31TB2",
  },
  {
    email: "sophie.findlay@ons.gov.uk",
    id: "CdOvj9S67WTNVYbDagBgXNulCkH3",
  },
  {
    email: "david.charles@ons.gov.uk",
    id: "CttYhVDLzkg8ftrYGDWAvlX2G8x1",
  },
  {
    email: "christian.battrick@ons.gov.uk",
    id: "CzQbG6rMMZfEfzUEUyQQ2TFxEBd2",
  },
  {
    email: "david.geran@ext.ons.gov.uk",
    id: "E4dgObt5YgVStvBUQSdTpWD1uGl1",
  },
  {
    email: "kimberley.frame@ons.gov.uk",
    id: "FsvoW20xCedG9fFiOg8oouMrKWm1",
  },
  {
    email: "yoganand.kunche@ons.gov.uk",
    id: "H9wKgs5beIbQZfUQ1vG8vn1Awi62",
  },
  {
    email: "louise.morris@ons.gov.uk",
    id: "IZSWH1IEeeOdcfSieq4MPbJWgLD2",
  },
  {
    email: "chirst@ons.gov.uk",
    id: "KeiMlz6hCXTiQ44JAWhlPzmqZAD2",
  },
  {
    email: "rachel.lewis@ons.gov.uk",
    id: "N00F1JFIOJfjqNBxAXb0lVclluQ2",
  },
  {
    email: "kate.thorsteinsson@ons.gov.uk",
    id: "Ni6i6fRhZ4e38rQxG0l4hUy5mRo1",
  },
  {
    email: "simon.brock-lowthian@ons.gov.uk",
    id: "PFsGnj5AiNawrZdTvIW6CTJJJwF3",
  },
  {
    email: "laura.wilson@ons.gov.uk",
    id: "PU3FfGVsG6M8WGdvwa5UnL6tJJ72",
  },
  {
    email: "gareth.yeoman@ons.gov.uk",
    id: "S319uU7MlrOiuUIxOPpcUnuWIVg2",
  },
].map(user => {
  return {
    name: user.email
      .split("@")[0]
      .split(".")
      .map(capitalize)
      .join(" "),
    ...user,
  };
});

export default users;
