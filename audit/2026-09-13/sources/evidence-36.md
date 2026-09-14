# SAP LeanIX

English

Provide feedback on our search



# Fact Sheet Mapping Between ServiceNow and SAP LeanIX

Configure mappings between specific fields in SAP LeanIX fact sheets and ServiceNow
tables.

## Configuring a Fact Sheet Mapping

To configure mappings between fact sheet fields and
ServiceNow tables, start by creating fact sheet mappings. After that, proceed to
configure field mappings.

Follow these steps:

1. On the ServiceNow configuration page, navigate to the
Mappings tab.

2. To create a new mapping, under Fact Sheet Mapping,
click Add Fact Sheet Mapping. If the mapping you need
already exists, select it and adjust the configuration as needed.



![Adding a fact sheet mapping.](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio7733504a7f4047a5a23bcdff73406a2e_LowRes.png)

Adding a Fact Sheet Mapping

3. Configure mapping parameters.

1. Define the fact sheet type, synchronization direction, ServiceNow table,
      and synchronization mode.

2. Configure field mappings. For detailed information, see [Configuring Field Mappings](https://help.sap.com/docs/leanix/ea/fact-sheet-mapping-between-servicenow-and-sap-leanix?locale=en-US&state=PRODUCTION&version=CLOUD#loio275ca5f57a4410149871ec89426715ea__configuring_field_mappings).

3. Optionally, configure synchronization filters (constraints) to limit the
      number of synced records. For details, see [Synchronization Filters](https://help.sap.com/docs/leanix/ea/fact-sheet-mapping-between-servicenow-and-sap-leanix?locale=en-US&state=PRODUCTION&version=CLOUD#loio275ca5f57a4410149871ec89426715ea__synchronization_filters).
4. To save a mapping without activating it, turn off the toggle next to the fact
sheet type.

5. Save your changes.


Once you’ve added fact sheet mappings, you can modify, activate, deactivate, or
delete them.

## Fact Sheet Mapping Parameters

For each mapping, you can define the rules for syncing specific fields between SAP LeanIX fact
sheets and ServiceNow tables.

The table below lists fact sheet mapping parameters.

| Parameter | Description |
| --- | --- |
| Fact Sheet Type | The type or subtype of a fact sheet in SAP LeanIX, such as application, business capability, or tech category. This<br>includes all fact sheets configured in your workspace's meta model,<br>encompassing both standard and custom types and subtypes. |
| Direction / Source | The direction of data synchronization: from ServiceNow to SAP<br>LeanIX or the other way around. |
| ServiceNow Table | The name of the table in ServiceNow with its logical table name, for example, `Business Application -<br>cmdb_ci_business_app`. |
| Sync Mode | The mode of synchronization defining how to handle objects in the target system that have no<br>corresponding items in the source system. For detailed information,<br>see [Sync Mode](https://help.sap.com/docs/leanix/ea/servicenow-integration?locale=en-US&state=PRODUCTION&version=CLOUD#loio275cad557a441014a42ef5e0f9d2887f__sync_mode). |
| Filter (Constraints) | Optional filters that establish synchronization constraints. Examples include synchronizing<br>applications with a particular lifecycle status or synchronizing<br>only those software product models installed on a server tied to a<br>managed business application. For detailed information, see [Synchronization Filters](https://help.sap.com/docs/leanix/ea/fact-sheet-mapping-between-servicenow-and-sap-leanix?locale=en-US&state=PRODUCTION&version=CLOUD#loio275ca5f57a4410149871ec89426715ea__synchronization_filters). |
| Field Mapping | The mappings between specific fields within SAP LeanIX fact sheets and ServiceNow tables. For detailed information, see<br>[Configuring Field Mappings](https://help.sap.com/docs/leanix/ea/fact-sheet-mapping-between-servicenow-and-sap-leanix?locale=en-US&state=PRODUCTION&version=CLOUD#loio275ca5f57a4410149871ec89426715ea__configuring_field_mappings). |





## Configuring Field Mappings

After setting up a fact sheet mapping, you can configure field mappings for it.

Follow these steps:

1. Hover over a fact sheet mapping, then click Configuration under
Field Mapping.



![Navigating to Field Mapping Configuration](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loioc139ecd93631420ab9c7bf0f642b8982_LowRes.png)

Navigating to Field Mapping Configuration

2. On the field mapping page, add mappings by clicking Add Fields, then
configure mapping parameters. For more information on each parameter, refer
to the following sections in this topic.

3. If relevant, set up matching rules to define how the integration identifies
matching items. For more information, see [Matching Rules in the ServiceNow Integration](https://help.sap.com/docs/leanix/ea/matching-rules?locale=en-US&state=PRODUCTION&version=CLOUD "Set up rules for matching fact sheets between ServiceNow and SAP LeanIX during the initial synchronization.").



![Configuring Field Mappings for a Fact Sheet](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274c3ee47a441014a5b6b1f8f199b26f_LowRes.png)

Configuring Field Mappings for a Fact Sheet

4. Save your changes.


## Field Mapping Parameters

The table below lists the parameters for configuring field mappings.

| Parameter | Description |
| --- | --- |
| Mapping Type | The type of field mapping. For detailed information, see [Mapping Type](https://help.sap.com/docs/leanix/ea/fact-sheet-mapping-between-servicenow-and-sap-leanix?locale=en-US&state=PRODUCTION&version=CLOUD#loio275ca5f57a4410149871ec89426715ea__mapping_type). |
| LeanIX Field | Fact sheet fields, tag groups, external IDs, subscriptions, and lifecycles in SAP LeanIX. The list of available fields is based on the selected mapping<br>type. |
| Direction | The direction of data synchronization for a field: from SAP<br>LeanIX to ServiceNow or the other way around. |
| ServiceNow Field | Attributes within the specified ServiceNow table.<br>Important: Not all ServiceNow attributes are<br>supported for synchronization. While the `FOREIGN_FIELD` mapping displays all attributes<br>available in the table, not every field is currently supported<br>for synchronization with SAP LeanIX. |
| Additional Configuration Details (Configure Details<br>button) | Additional configuration parameters that are only available for<br>certain mapping types, such as `FIXED_VALUE`.<br>For detailed information, see [Additional\<br>Configuration Details](https://help.sap.com/docs/leanix/ea/fact-sheet-mapping-between-servicenow-and-sap-leanix?locale=en-US&state=PRODUCTION&version=CLOUD#loio275ca5f57a4410149871ec89426715ea__additional_configuration_details). |





## AI-Generated Field Mapping Suggestions

To streamline the process of configuring field mappings, you can use the AI
capabilities optional feature. To learn how to activate this feature, see [Base AI Capabilities](https://help.sap.com/docs/leanix/ea/base-ai-capabilities?locale=en-US&state=PRODUCTION&version=CLOUD "Embedded assistance in SAP LeanIX, such as inventory AI prompts, AI‑assisted text, AI‑generated context, AI‑supported translation, and more. These capabilities are included in LeanIX once you agree to the SAP LeanIX AI terms.").

To generate field mapping suggestions using AI, on the field mapping configuration
page, click Generate Fields. AI generates mapping suggestions based on common
patterns and your system configuration. Before applying suggested mappings, review
and adjust them as needed. You can edit fields manually as well as add or remove
fields.

![Generating Field Mapping Suggestions Using AI Capabilities](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio27523c597a4410149134e0fe715207b3_LowRes.png)

Generating Field Mapping Suggestions Using AI Capabilities

## Mapping Type

![Mapping Type dropdown](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio27460e547a441014941cc265b15d65c0_LowRes.png)

Mapping Type dropdown

The following table contains mapping types.

| Mapping Type | Description | Mandatory Fields | Supported ServiceNow Attribute Type | Supported SAP LeanIX Field Type |
| --- | --- | --- | --- | --- |
| `FOREIGN_FIELD` | Maps the (untranslated) value (ignoring any labels in SN or SAP LeanIX) of a field to the corresponding field in the child<br>system. | - Fact Sheet Field<br>  <br>- Foreign Field | - String<br>  <br>- Choice (will send untranslated values) | Text, Location (will map the raw location address), Lifecycle<br>(will map the name of the current phase), Lifecycle Phase (will map<br>the start date of the respective phase). Location and Lifecycle<br>(current phase) fields can only be used as a source of data,<br>synchronizing from SAP LeanIX to ServiceNow. |
| `URL` | Used to map the URL of the SAP LeanIX Fact Sheet to the foreign object. | Foreign Field | String | n/a |
| `FIXED_VALUE` | Only to be used to set a constant string value to be sent on<br>every synchronized object. | Fact Sheet Field or Foreign Field | String | n/a |
| `VALUE_MAPPING` | Used to map fields with multiple choices. | - Fact Sheet Field<br>  <br>- Foreign Field | Choice (1:1 mapping only)\* certain exceptions explained<br>below | Single Select, Multiple Select (See Advanced Information<br>section) |
| `SUBSCRIPTION` | Used to map subscription values between the systems.<br>When the data sync direction is from SAP LeanIX to ServiceNow, the following options are available:<br>- Subscription type<br>  <br>- Subscription role<br>  <br>- Subscription role and type | Fact sheet field | - Reference fields that directly refer to the `sys_user` or `sys_user_group` table, for example, `business_owner` field.<br>  <br>- Glide list fields that directly refer to the `sys_user` table. | Fact sheet subscriptions |
| `ARCHIVED_STATUS_MAPPING` | Only Allowed when SAP LeanIX is the source. If a fact sheet is archived, then a special value<br>is written to ServiceNow | Foreign Field | Choice. e.g. `operational_status` field updated with 6. Which has the<br>label `Retired`. | n/a |
| `TAG_GROUP_FIELD` | Used to map tag group fields | Fact Sheet Field (Tags only / Other Tags) Foreign Field | String | Tag Groups, Other Tags |
| `TAG_GROUP_MAPPING` | Used to map tag groups with multiple tags within them. | - Fact Sheet Field (Tags Groups)<br>  <br>- Foreign Field | Choice | Tag Groups |
| `EXTERNAL_ID` | This type is used to map an SAP LeanIX `ExternalId` field to a ServiceNow column. | - Fact Sheet Field (Tags Groups)<br>  <br>- Foreign Field | String | External ID Fields |
| `RELATED_FACTSHEETS` | Maps a comma-separated list of Display Names of the related Fact<br>Sheets found for the selected relation. | - Fact Sheet Field (relation name)<br>  <br>- Foreign Field | String (Limited to 100 fact sheets. Once the limit is reached, text is added in the end (+X<br>more). | Relation |





To learn more about field types in ServiceNow, refer to the [ServiceNow documentation.![Information published on non-SAP site](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/themes/sap-light/img/3rd_link.png)](https://help.sap.com/docs/link-disclaimer?site=https%3A%2F%2Fdocs.servicenow.com%2Fbundle%2Frome-platform-administration%2Fpage%2Fadminister%2Freference-pages%2Freference%2Fr_FieldTypes.html?locale=en-US&state=PRODUCTION&version=CLOUD "https://docs.servicenow.com/bundle/rome-platform-administration/page/administer/reference-pages/reference/r_FieldTypes.html").

## Additional Configuration Details

Configure Details is a button that is only offered for some
special mapping types to provide more configuration, like a mapping of fixed values
for choices.

One example of the use of the Configure Details section is the
`VALUE_MAPPING`. `VALUE_MAPPING` is used when
fixed values from `SINGLE_SELECT` fields must be mapped to choices in
the `CHOICE` field type in ServiceNow.

The example below shows `VALUE_MAPPING` configuration of SAP LeanIX's
`businessCriticality` field with ServiceNow's
`business_criticality` attribute.

![](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2749c7467a4410149e6aee4b8a132495_LowRes.png)

Here the left side indicates the `Meta Model` name values of within
the businessCriticality field in SAP LeanIX.
Similarly, the right side is mapped to the value of the choices within the
`business_criticality` attribute in ServiceNow.

![The left column contains the strings used on the SAP LeanIX side, and the right column contains the values used in ServiceNow choice fields.](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2755d0157a441014990cb1c55c6afe51_LowRes.png)

The left column contains the strings used on the SAP LeanIX
side, and the right column contains the values used in ServiceNow choice
fields.

The meta model keys are visible within brackets, as seen below -

![The `data-model` values in -](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio27448a3a7a441014997bd42ab9b0264a_LowRes.png)

The `Meta Model` values in - "()"

Similarly, within ServiceNow, they can be seen by right-clicking on the field and
selecting "Show Choice List"(Admin access required) -

![3496](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274c846e7a441014814592f77f1fd252_LowRes.png)

Select - `Show Choice List`

Only the `VALUES` section is required for the mapping -

![3496](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274b3f5a7a44101485d1ed75070c4241_LowRes.png)

Only the `Value` section is required for the mapping

Each `VALUE_MAPPING` is validated when you save the configuration, and
during every synchronization, to ensure only valid values are used for mapping from
SAP LeanIX
to ServiceNow.

![`n:1` Value Mapping support. Business Operational and Administrative Service Criticality both get mapped to the Low choice in ServiceNow.](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274c52d17a441014854ef2cd40952514_LowRes.png)

`n:1` Value Mapping support. Business Operational and
Administrative Service Criticality both get mapped to the Low choice in
ServiceNow.

## Synchronization Filters

Synchronization filters enable you to refine
fact sheet mappings by limiting the number of records synchronized. The
configuration of filters depends on which system is designated as the source of
truth:

- If SAP LeanIX
is the source of truth, add the necessary filters in SAP LeanIX.

- If ServiceNow is the source of truth, add the necessary filters in ServiceNow,
then select these filters in SAP LeanIX.
In this scenario, filters are referred to as constraints.


Additionally, you can configure graph rule constraints to determine whether a record
should be synchronized based on a connection identified in ServiceNow.

![Configuring Synchronization Constraints](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274a6c437a44101498d2e54b70393315_LowRes.png)

Configuring Synchronization Constraints

## Filtering from SAP LeanIX to ServiceNow

When SAP LeanIX is
the source system, you can apply inventory filters to fact sheet mappings to only
send specific fact sheet fields to the corresponding ServiceNow table. Here are
examples of frequently used filters for application fact sheets:

- Approved quality seal: Only send applications that have an approved
quality seal to ServiceNow.

- Active lifecycle phase: Only send applications that are in the Active
lifecycle phase to ServiceNow.


To add a filter, follow these steps:

1. Hover over a fact sheet mapping where the synchronization direction is
from LeanIX, then click Filters under Filter.



![Configuring Sync Filters when SAP LeanIX Is the Source System](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio4e93adf3058e4ad6a26b0db96810847b_LowRes.png)

Configuring Sync Filters when SAP LeanIX Is the Source System

2. In the filter overlay that appears, select fact sheet attributes to be
synchronized, then click Use Fact Sheet Filter.

3. Save your changes.


## Filtering from ServiceNow to SAP LeanIX

When ServiceNow is the source system, you can add a filter in ServiceNow to limit the
number of records that are sent to SAP LeanIX. These
filters are also referred to as constraints.

To add a filter, follow these steps:

1. In ServiceNow, create a filter for the table from which data is synchronized.
Once you save the filter, it appears in SAP LeanIX.

You can create a filter by either impersonating an integration user or using
an admin user. If you're impersonating an integration user, you can make the
filter visible only to this user ( `me`). If you're signed in
as an admin, set the filter permission to `everyone` or
`group` to ensure that the integration user can access
the filter.



![Configuring a Filter in ServiceNow](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274bfb327a441014873085a90352e0ae_LowRes.png)

Configuring a Filter in ServiceNow

2. In SAP LeanIX:

1. Hover over a fact sheet mapping for which you created a filter, then
      click Constraints under Filter.



      ![Configuring Sync Filters in SAP LeanIX when ServiceNow Is the Source System](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio5d25b94066794d57b4be068b360f7c72_LowRes.png)

      Configuring Sync Filters in SAP LeanIX when ServiceNow Is the Source System

2. In the overlay that appears, select the filter that you created.

3. Save your changes.

## Graph Rule Constraints

A graph rule constraint controls whether a record is synchronized at all based on a
connection found on the ServiceNow side. Depending on the ServiceNow table used in a
mapping from ServiceNow to SAP LeanIX,
different or no graph rule constraint might be applicable.

To open the configuration dialog, click Constraints on a
mapping. Sync constraints are available when ServiceNow is the source and the
configured ServiceNow table supports graph rules.

![Adding a Graph Rule Constraint](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2745e39d7a441014bd24f21d4c1eced3_LowRes.png)

Adding a Graph Rule Constraint

The following graph rule constraints are available:

| Graph Rule | Definition | Required Active Mapping and Plugin |
| --- | --- | --- |
| `APPLICATION_SAM_CONNECTION` or<br>`APPLICATION_SAM_PRO_CONNECTION` | Synchronize this Software Product Model or Hardware Product Model, if a connection to an<br>Application mapped table exists that can be found via the SAM<br>module. Further filtering can be done while using this Graph<br>Constraint. For more information, see [Graph Rule Constraints](https://help.sap.com/docs/leanix/ea/fact-sheet-mapping-between-servicenow-and-sap-leanix?locale=en-US&state=PRODUCTION&version=CLOUD#loio275ca5f57a4410149871ec89426715ea__graph_rule_constraints). | - For APPLICATION\_SAM\_CONNECTION: SAM + Discovery Service<br>  <br>- For APPLICATION\_SAM\_PRO\_CONNECTION: SAM PRO + Discovery<br>  Service<br>  <br>- IT Component - Software/Hardware <br>  <br>  - `cmdb_software_product_model` or<br>    <br>  - `cmdb_hardware_product_model` |
| `IN_USE_SAM_CONNECTION` or `IN_USE_SAM_PRO_CONNECTION` | Synchronize this Software Product Model or Hardware Product<br>Model, if a connection to Hardware exists that can be found via the<br>SAM module. | - For APPLICATION\_SAM\_CONNECTION: SAM + Discovery Service<br>  <br>- For APPLICATION\_SAM\_PRO\_CONNECTION: SAM PRO + Discovery<br>  Service<br>  <br>- IT Component - Software/Hardware<br>  <br>  - `cmdb_software_product_model` or<br>    <br>  - `cmdb_hardware_product_model` |
| `MODEL_CATEGORY` | Synchronize this Product Model, if a connection to a Model<br>Category exists in SN. | - IT Component - Software - `cmdb_software_product_model`<br>  <br>- Technical Categories - `cmdb_model_category` |
| `APPLICATION_HARDWARE_CONNECTION` | Synchronize this Hardware Product Model, if a connection to a<br>Business Application exists. Tip - Check the Additional Information tab for further filter options on this Graph Constraint. | - IT Component - Hardware - `cmdb_hardware_product_model`<br>  <br>- Application - `cmdb_ci_business_app` |
| `IN_USE_HARDWARE_CONNECTION` | Synchronize this Hardware Product Model, if a connection to a<br>Hardware exists. | - IT Component - Hardware - `cmdb_hardware_product_model` |
| `APPLICATION_SOFTWARE_MANAGEMENT_MODEL_CONNECTION` | Synchronize this Software Product Model, if a connection to a<br>Business Application exists that can be found via the Software<br>Management module. | Only supported when legacy configuration is in use, see [Legacy Configuration](https://help.sap.com/docs/leanix/ea/servicenow-integration?locale=en-US&state=PRODUCTION&version=CLOUD#loio275cad557a441014a42ef5e0f9d2887f__legacy_configuration)<br>- IT Component - Software - `cmdb_software_product_model`<br>  <br>- Application - `cmdb_ci_business_app` |
| `IN_USE_SOFTWARE_MANAGEMENT_MODEL_CONNECTION` | Synchronize this Software Product Model, if a connection to a<br>Hardware exists that can be found via the Software Management<br>module. | Only supported when legacy configuration is in use, see [Legacy Configuration](https://help.sap.com/docs/leanix/ea/servicenow-integration?locale=en-US&state=PRODUCTION&version=CLOUD#loio275cad557a441014a42ef5e0f9d2887f__legacy_configuration)<br>- IT Component - Software - `cmdb_software_product_model` |
| `SYSTEM_SAM_CONNECTION` | Synchronizes a software product model only if SAM or Discovery<br>shows a connection to a System CI. Use this constraint when you want<br>to import software models that SAM links to System CIs. | - Fact sheet mappings for the system and IT component<br>  (hardware) fact sheet types to ServiceNow tables<br>  <br>- Relation mapping between the corresponding system and IT<br>  component (hardware) fact sheet types to identify these<br>  connections in `cmdb_rel_ci` |
| `SYSTEM_SAM_PRO_CONNECTION` | Synchronizes a software product model only if SAM Pro shows a<br>connection to a System CI. Use this constraint when you want to<br>import software models that SAM links to System CIs. | - Fact sheet mappings for the system and IT component<br>  (hardware) fact sheet types to ServiceNow tables<br>  <br>- Relation mapping between the corresponding system and IT<br>  component (hardware) fact sheet types to identify these<br>  connections in `cmdb_rel_ci` |

[... middle omitted — see footer ...]






The relations between applications and IT components are discovered in ServiceNow
using graph rule constraints. This information is abstracted by the integration, and
only the abstracted information is pulled into SAP LeanIX. Then
the relations between applications and IT components can be fetched using the
`GRAPH_RULE_CONSTRAINT` relation. For more information, see [GRAPH\_RULE\_CONSTRAINT](https://help.sap.com/docs/leanix/ea/relation-mapping-between-servicenow-and-sap-leanix?locale=en-US&state=PRODUCTION&version=CLOUD#loio275ca9ca7a4410148b008ed7c66f1cfe__graph_rule_constraint).

## Mapping Multiple-Select Fields

The integration can sync between Multiple Select fields in SAP LeanIX with
Glide Lists fields of ServiceNow that refer to a table in ServiceNow.

Prerequisites

- Multiple Select Field with values in SAP LeanIX

- GlideList field in ServiceNow, with the values of the records you wish to map to
SAP LeanIX or the `sys_id` of
the records in the referenced table in ServiceNow.


![3584](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274d8e397a441014b7b2f7c6dfedace7_LowRes.png)

Example `MULTIPLE_SELECT` field in SAP LeanIX
with the values of `legal`, `sales`,
`finance`, and `hr`.

Within ServiceNow however, there can be two types of `list`
fields.

- List fields that reference another ServiceNow Table


![3584](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274601c77a441014b4ecb4d90a97e232_LowRes.png)

Example of a List field `u_lix_multiple_select_bu_table` which
references the `business_unit` table in ServiceNow.

- List fields that do not refer to another ServiceNow Table and have a choice list
defined


![3496](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274ee2607a4410149432e05cab72b79a_LowRes.png)

Example of a List field `u_lix_multiple_select_no_reference`
which does NOT refer to any table but has set choices listed.

To map both of these fields, the Mapping Type of `VALUE_MAPPING` is
used.

![`VALUE_MAPPING` type dynamically understands if the SAP LeanIX field is `SINGLE_SELECT` or `MULTIPLE_SELECT`](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274ace807a441014bd1ee2486d94c07f_LowRes.png)

`VALUE_MAPPING` type dynamically understands if the SAP LeanIX
field is `SINGLE_SELECT` or
`MULTIPLE_SELECT`

- Example Extra field mapping when the field is referencing another table -


Collect the `sys_id` of all the records you wish to map with the
multiple select values in SAP LeanIX, this
can be done for multiple records by exporting or by selectively copying the
`sys_id` as follows -

![3584](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274d08677a4410149891a8064a8b1c46_LowRes.png)

Copy or collect the `sys_ids` of all the records that are to
be mapped in SAP LeanIX

These collected `sys_ids` can be mapped to SAP LeanIX as
follows -

![In this case, the ServiceNow side of the extra fields section expects for the `sys_id` to match to when sending or pulling data to sync with the Multiple Select Fields.](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio27433caf7a441014a14ae77b4d9081b4_LowRes.png)

In this case, the ServiceNow side of the extra fields section expects the
`sys_id` to match when sending or pulling data to sync with
the Multiple Select Fields.

Once saved, the sync will automatically match the `sys_ID` with the
respective record in ServiceNow. Similarly, it will also match the
`sys_ID` with the mapped field in SAP LeanIX from
the extra fields section.

Examples

![3584](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio275322b47a441014aebb8d51145765c1_LowRes.png)

Example of the sync from SAP LeanIX
sending the values to the highlighted glide list field.

![3584](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274834de7a441014a6ef892a25234add_LowRes.png)

Example of the sync from ServiceNow sending the values to the highlighted
multiple select fields in SAP LeanIX.

## Mapping Lifecycle and Date Fields

This section provides an overview of the supported methods for syncing lifecycle and
date fields between ServiceNow and SAP LeanIX. The
following table details each scenario and the required configurations.

| Case | Description | Source of Truth | Configuration |
| --- | --- | --- | --- |
| Case 1 | The current lifecycle phase is pushed from SAP LeanIX to a ServiceNow field. | SAP LeanIX | Use `VALUE_MAPPING` as the mapping type. In the LeanIX Field list, select the main field `lifecycle`,<br>not one of the lifecycle phases (such as `lifecycle/active` or `lifecycle/phaseIn`). The synced value is not a `Date` but a<br>`String` representing the current phase. |
| Case 2 | Lifecycle date values are pulled from ServiceNow to SAP LeanIX<br>lifecycle phase fields. | ServiceNow | Map each `Date` field in ServiceNow to a lifecycle phase in SAP LeanIX, such as `lifecycle/plan`. The input date must be in the format<br>`yyyy-mm-dd` (for example, `2014-01-01`). |
| Case 3 | Lifecycle phase dates are pulled and pushed from SAP LeanIX to ServiceNow `Date` fields. | SAP LeanIX | Map each phase in SAP LeanIX, such as `lifecycle/plan`, to a `Date` field in<br>ServiceNow. |
| Case 4 | String fields in SAP LeanIX pull date values from ServiceNow. | ServiceNow | In the fact sheet configuration in SAP LeanIX, create a field of type `String` which<br>is displayed as `Date`. In field mappings, you can use the `FOREIGN_FIELD`<br>mapping type. ![Custom Field Configuration in SAP LeanIX](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio274276f77a441014a793bb605eb50388_LowRes.png) |
| Case 5 | String fields in SAP LeanIX push date values to ServiceNow. | SAP LeanIX | See configuration details for case 4. |





## Mapping Multiple Fact Sheet Types to One ServiceNow Table

You can map multiple fact sheet types to the same ServiceNow table in the following
cases:

- ServiceNow is the source of truth for mappings.

- Filters are set to ensure that there is no overlap in data synchronization.


An example scenario might involve records in ServiceNow that are not yet fully
distributed across the appropriate tables, and instead, reside within a single
table, such as the `cmdb_ci_appl` table. In this case, you can link
this table to both applications and IT components, making ServiceNow the source of
truth. To ensure accurate data synchronization, you also need to set appropriate
filters.

![`cmdb_ci_appl` table is linked to both Applications and IT Component Software with ServiceNow as the source of truth and appropriate Filters set.](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio7c14ec9758d54f57b9ec0fd3b43360d2_LowRes.png)

Mapping Multiple Fact Sheet Types to One ServiceNow Table

──────── [TRUNCATED] ────────
Showing 22,443 chars (head) + 6,873 chars (tail) of 31,487 total clean characters.
Full text saved to: C:\Users\ATDSOL\AppData\Local\hermes\cache\web\help.sap.com-fae17d1e39.md
To read the omitted middle: read_file path="C:\Users\ATDSOL\AppData\Local\hermes\cache\web\help.sap.com-fae17d1e39.md" offset=340 limit=200  (the file is the complete page; raise/lower offset to page through it).
─────────────────────────────