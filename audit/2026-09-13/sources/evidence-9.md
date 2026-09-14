# SAP LeanIX

English

Provide feedback on our search



# Mandatory Attributes

Mandatory attributes are essential fields specified by admins to ensure data
integrity and quality in fact sheets. They must be filled out for fact sheets to approve
quality seal, ensuring consistent and reliable information.

## Introduction

Mandatory attributes are essential attributes that users
must fill out to maintain data integrity and quality standards in a fact sheet.
Admins can specify which attributes are mandatory for a particular fact sheet type
to ensure essential information is consistently gathered. These mandatory attributes
can include fields, relations, tag groups, and subscription roles and types.

When mandatory attributes are defined for a fact sheet type, any newly created fact
sheets must have all these attributes filled before their quality seal can be
approved. This helps maintain data integrity and reliability, ensuring that fact
sheets meet the necessary standards before being approved.

## Filling Mandatory Attributes

When mandatory attributes are defined by
the admin, they appear listed on the right-side panel of the fact sheet until the
quality seal is approved. Checkboxes next to them indicate whether they are filled
or not. You can use the list to conveniently navigate to the respective fields and
provide the needed input.

![Filling Mandatory Attributes](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274b37d67a44101491d4cc3dab7cae35_LowRes.gif)

Filling Mandatory Attributes

For mandatory relations, you have to specify at least one relation in the field.
Setting the relation empty by selecting Leave empty also counts as a filled
relation.

![Leaving a Mandatory Relation Empty on Purpose](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2741b2717a44101490fbf523a9b9124a_LowRes.png)

Leaving a Mandatory Relation Empty on Purpose

Similarly, you have to assign at least one tag if a tag group is defined as
mandatory.

The mandatory subscriptions, if defined, are also listed on the right-side panel of
the fact sheet. Click on the item to open the subscription overlay and add the
appropriate person as a subscriber. To learn more about subscriptions, see [Subscription Roles](https://help.sap.com/docs/leanix/ea/subscription-roles?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to create, edit, and delete subscription roles and manage settings like enabling the “Accountable” subscription type, limiting multiple subscriptions, and enforcing mandatory role selection.").

## Mandatory Attributes and Quality Seal

When mandatory attributes are
defined for a fact sheet type, the quality seal of a fact sheet can be approved by
the responsible or accountable subscribers only when all mandatory attributes are
populated.

Before the fact sheet is approved, the values of mandatory fields can be edited or
even removed to leave them empty. Once a fact sheet is approved, you can still edit
the value of the mandatory field, but it is not possible to remove the value of the
mandatory field and leave it empty. You can do it only after setting the fact sheet
quality seal back to Draft.

Similarly, the last remaining value of mandatory relations, tags, and subscribers can
be edited but can not be removed from an approved fact sheet without setting the
fact sheet quality seal back to Draft.

To learn more about quality seals and quality seal states, see [Quality Seal](https://help.sap.com/docs/leanix/ea/quality-seal?locale=en-US&state=PRODUCTION&version=CLOUD "Quality seal ensures data integrity by assigning approval responsibility to accountable and responsible subscribers of fact sheets. When broken, it prompts verification and approval of fact sheet information.").

## Defining Mandatory Attributes

Admins can define mandatory attributes in
the fact sheet configuration page and mandatory attributes are defined separately
for each fact sheet type. To define mandatory attributes, do the following:

1. In the administration area, select Meta Model Configuration.

2. Select the fact sheet type for which the mandatory attributes need to be
defined.

3. Go to the Quality Seal tab and select the Draft quality seal state
checkbox.


1. Define the mandatory attributes by selecting the required fields, relations,
subscriptions, and tag groups from the respective sections. The drop-down menus
in each section list all active and possible fields that can be set as
mandatory.

2. Click Save to save the changes.


![Configuring Mandatory Attributes](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2757652d7a441014bbecc742d3a791b6_LowRes.png)

Configuring Mandatory Attributes

Except for the Description field, base fields such as ID, Display Name, Level, or Status can not be made mandatory. Similarly, read-only
fields and attributes in the Unused Fields and Relations section can not be
made mandatory.

User-created custom attributes can be set as mandatory.

Mandatory subscriptions can be defined based on subscription type, subscription role,
or even specific subscription role of a particular subscription type.

- Selecting a subscription type (Observer, Responsible, or Accountable)
mandates having at least one subscriber of that type for the fact sheet.

- Selecting a subscription role under a subscription type mandates having at least
one subscriber of that role, specifically of that type.

- Selecting a subscription role under Any type mandates having at least one
subscriber of that role, regardless of subscription type.


![Defining Mandatory Subscription](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274514bf7a441014b98d9395664c00a4_LowRes.png)

Defining Mandatory Subscription

## Interoperability of Mandatory and Conditional Attributes

Mandatory
attributes and conditional attributes are interoperable. They can coexist and
function properly without conflicting with each other. This allows you to have
conditionally activated fields and relations at the fact sheet subtype level, even
though the mandatory attributes are defined for the fact sheet type. To learn about
conditional attributes, see [Conditional\\
Attributes](https://help.sap.com/docs/leanix/ea/conditional-attributes?locale=en-US&state=PRODUCTION&version=CLOUD "Conditional attributes allow fields and relations in fact sheets to be visible based on related field values. Conditional attributes enables tailoring of attributes for subtypes, streamlining subtype management.").

To illustrate, in IT component fact sheets, say you have the need to make the
Release field mandatory and, at the same time, make it visible only for
the software subtype.

In this case, you define the Release field as mandatory, and in the
conditional attribute tab, add a condition to make it a conditional attribute.
Define the condition using Subtype as the activator and Software as
the activating value.

![Defining Conditional Attribute](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2750a7e17a4410149a4a9245d5c75845_LowRes.png)

Defining Conditional Attribute

The Release field will be visible and listed as a mandatory attribute in the
software IT component subtype, while it will not be visible or mandatory in the rest
of the IT component fact sheet subtypes.

![Mandatory Field Made Conditional For A Fact Sheet Subtype](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2753d80c7a4410149fe1fd17b6d551cd_LowRes.jpg)

Mandatory Field Made Conditional For A Fact Sheet Subtype