# SAP LeanIX

English

Provide feedback on our search



# Quality Seal

Quality seal ensures data integrity by assigning approval responsibility to
accountable and responsible subscribers of fact sheets. When broken, it prompts verification
and approval of fact sheet information.

## Introduction

Quality seal is a mechanism to ensure the overall
integrity and quality of data on fact sheets. It assigns accountability to the
responsible or accountable user to approve the quality of a fact sheet whenever
other users make any changes to the fact sheet. When the quality seal is broken, it
triggers a Check needed status at the top of the fact sheet. This prompts the
responsible individual to verify the data and provide their approval by approving
the quality seal of the fact sheet.

## Breaking of Quality Seal

As a rule of thumb, users who have permission to update the quality seal do not
automatically break it when they change fact sheet fields.

The following table provides information on who can or can not break the quality seal
as per the default settings:

| Role | Breaking Quality Seal |
| --- | --- |
| Admins | Admins can edit any fact sheet without breaking the quality<br>seal. |
| Members | Responsible or accountable subscribers of a fact sheet can edit<br>information on that fact sheet without breaking the quality seal.<br>Conversely, a fact sheet's quality seal is broken when members who<br>are not responsible or accountable subscribers for that fact sheet<br>update its attributes. |
| Viewer | Viewers cannot break the quality seal as they do not have the<br>right to make any changes to fact sheets. |





The quality seal breaks when attributes are updated, including:

- base fields like name, description, etc.

- updates to fields such as alias, release, etc.

- updates to mandatory and non-mandatory fields

- updates to ExternalID

- updates to resources

- updates to relations, such as ApplicationToBusinessCapabilityRelation,
ParentChildRelation, etc.

- However, operations under the subscriptions, comments, metrics, and surveys
sections do not break the quality seal.


Additionally, the workspace administrator can configure a renewal interval (e.g., 30
days, 3 months, etc.), after which the quality seal automatically breaks, ensuring
continuous data quality maintenance. The renewal interval only considers changes to
the quality seal status. The interval resets and starts counting when the quality
seal is approved. It does not take into account any other updates or modifications
made to the fact sheet itself. To learn how to configure the renewal interval, see
[Enabling or Disabling the Quality Seal](https://help.sap.com/docs/leanix/ea/quality-seal?locale=en-US&state=PRODUCTION&version=CLOUD#loio275bf80d7a4410148ac1c4fbce489213__enabling_or_disabling_the_quality_seal).

## Quality Seal States

- Check needed: Indicates that the quality seal is broken and verification
is required due to changes made by users who are not responsible or accountable
for the fact sheet.

- Approved: Indicates that the fact sheet has been reviewed and approved by
the responsible or accountable user.

- Draft: Indicates that the fact sheet is not yet finalized or approved.
This is an additional state that can be enabled by the admin. When enabled, all
new fact sheets with mandatory attributes will be created in the draft
state.

- Rejected: This is an additional state that can be enabled by the admin.
This state can indicate that the fact sheet is being removed from the data
quality process, and there is no need to maintain it further.


## Quality Seal States of New Fact Sheets

The quality seal state of the newly created fact sheet is determined by how the
quality seal states are enabled by admins. To learn more, see [Enabling or Disabling the Quality Seal](https://help.sap.com/docs/leanix/ea/quality-seal?locale=en-US&state=PRODUCTION&version=CLOUD#loio275bf80d7a4410148ac1c4fbce489213__enabling_or_disabling_the_quality_seal).

Here is a summary of possible configurations and their impacts:

| Quality Seal State - Broken | Quality Seal State - Draft | New Fact Sheet State |
| --- | --- | --- |
| Enabled | Disabled | Broken (displayed as Check needed) |
| Enabled | Enabled | Draft |
| Disabled | Disabled | Approved |
| Disabled | Enabled | Draft |





## Approving Fact Sheet Quality

When the quality seal feature is enabled
for a fact sheet type, a quality seal icon appears at the top of each fact sheet of
that type. Responsible or accountable subscribers can click on the icon, and from
the drop-down menu, choose and change the quality seal state. You can approve the
quality seal by selecting Approve Fact Sheet.

![Approving or Changing Quality Seal State](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2749e3587a441014bd38f0cd5245c6e6_LowRes.png)

Approving or Changing Quality Seal State

Besides the automatic breaking of the quality seal when the fact sheet attributes are
changed, you can manually break it by selecting Break Quality Seal. It may be
necessary in certain situations to indicate that the information on the fact sheet
needs to be reviewed or updated. For example, if errors have been identified,
breaking the quality seal can prompt a review process to ensure accuracy and
completeness

![Manually Breaking Quality Seal](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2751de887a4410148aedc32566ad8e05_LowRes.png)

Manually Breaking Quality Seal

Users who do not have permission to change the quality seal see just the quality seal
of the fact sheet.

## Enabling or Disabling the Quality Seal

On the fact sheet configuration
page, admins can enable or disable the quality seal feature and quality seal states
for each fact sheet type.

To enable or disable the quality seal for a fact sheet type, do the following:

1. In the administration area, select Meta Model Configuration.

2. Select the fact sheet type for which the quality seal needs to be enabled or
disabled.

3. Go to the Quality Seal tab and select or unselect the checkbox next to
Broken to enable or disable the quality seal.

4. Set a renewal interval based on your requirements. Renewal interval ensures
that fact sheets' quality seal is periodically broken, even if fact sheet
attributes remain unchanged. This ensures that the information in the fact
sheet that needs to be periodically assessed, such as the functional fit or
technical fit of an application, is reviewed and validated.

5. Click Save to save the changes.



![Enabling or Disabling the Quality Seal in Fact Sheet Configuration Page](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274b6e797a441014a4fbb8cbbe5c2483_LowRes.png)

Enabling or Disabling the Quality Seal in Fact Sheet Configuration
Page


Similarly, you can choose to add additional quality seal states - Draft and
Rejected by checking their respective checkboxes.

## Notifications

When the quality seal of a fact sheet is broken, all
responsible and accountable subscribers of the fact sheet receive a notification.
These notifications are accessible through all channels configured in your
notification settings.

You can change your notification settings by navigating to Notifications under
My settings and selecting Data Quality. To learn more about
notifications, see [Notifications](https://help.sap.com/docs/leanix/ea/notifications?locale=en-US&state=PRODUCTION&version=CLOUD "Adjust your notification preferences to stay informed about significant changes in your workspace, monitor tasks that need your attention, and stay updated on other relevant activities.").

![Setting Notification for Breaking of Quality Seal](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274e9d107a441014b5f58880c4022ac9_LowRes.png)

Setting Notification for Breaking of Quality Seal