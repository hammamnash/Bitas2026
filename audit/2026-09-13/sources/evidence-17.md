# SAP LeanIX

English

Provide feedback on our search



# AI-Assisted Inventory Builder

The inventory builder uses AI to analyze diagrams, images, and text-based files. It
extracts fact sheets and relations to help you build your inventory faster. You can review,
adjust, and create fact sheets from discovered data.

## Overview

The inventory builder uses AI to analyze diagrams, images, and text-based file formats. It
automatically extracts relevant architectural elements and discovers appropriate
fact sheets and their relations. You can review these results and create
corresponding fact sheets to accelerate your inventory-building process.

## Benefits

- Simplify inventory building: Building the inventory can be
time-consuming and complex. It involves collecting and structuring data from
various artifacts like data flow diagrams, value stream charts, and images. The
inventory builder simplifies this process. It automatically transforms
unstructured data into structured information, such as fact sheets and
relations.

- Speed up adoption and maintenance: Automated discovery and
creation of architectural elements accelerate stakeholder onboarding and
adoption, inventory maintenance, and data editing tasks within your
organization.


![Video thumbnail](https://cdnapisec.kaltura.com/html5/html5lib/v2.101/modules/KalturaSupport/thumbnail.php/p/1921661/uiconf_id/37285991/entry_id/1_zf9goae2/height/480?&flashvars[parentDomain]=https%3A%2F%2Fhelp.sap.com%2Fdocs%2Fleanix%2Fea%2Finventory-builder%3Fversion%3DCLOUD)

[Open this video in a new window](https://www.kaltura.com/p/1921661/sp/192166100/embedIframeJs/uiconf_id/37285991/partner_id/1921661?iframeembed=true&playerId=kaltura_player&entry_id=1_zf9goae2)

## Prerequisites

- You have accepted the AI terms.

- You have purchased AI units and they are assigned to your tenant.

To
verify eligibility, go to Administration \> Optional Features
and Early Access and check the AI Features
section.


## Activating the Inventory Builder

The inventory builder is not enabled by default and must be
activated separately for eligible workspaces.

To activate the inventory
builder:

1. Go to Administration \> Optional Features
and Early Access.

2. Choose Activate next to AI-Assisted Inventory
Builder.


If AI units are not available, an information banner appears under AI
Features in the Optional Features and Early
Access section. To request activation of the inventory builder,
submit a support ticket.

![Optional Features and Early Access page showing AI feature activation options.](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loioa4c6944d8e584f47874d633ad544f3df_LowRes.png)

## Extracting Fact Sheets and Relations from Files

To extract architectural elements from files, upload the file and provide additional
context about its content. After you upload the file, the system automatically
suggests the types of fact sheets to extract. You can change the scope by adding or
removing fact sheet types and subtypes. The system detects all fact sheet types
defined in the meta model, whether default or custom. For best results with custom
types, include a brief definition in your prompt.

The inventory builder then analyzes the file and suggests lists of fact sheets and
relations that can be derived from it. It currently supports JPEG, JPG, PNG, CSV,
XML, TXT, MD, and JSON file formats.

To upload and analyze the file, do the following:

1. In the inventory, from the drop-down menu next to Add Fact
Sheet button, select Inventory
Builder.![The Inventory Builder option highlighted in the Add Fact Sheet dropdown menu in SAP LeanIX.](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2753ba4b7a4410148adda1af141d545d_LowRes.png)

2. On the resulting page, choose Import.

3. Upload your file by either dragging and dropping it or browsing your
system.

4. Optionally, modify the scope of fact sheet types to be extracted by adjusting
the ones automatically suggested by the system. Fact sheets of specified fact
sheet types are then extracted.

5. Optionally, provide additional context and specific instructions through prompts
to significantly improve the results.

For example, you could highlight
specific details in the diagram, such as specifying that dotted lines
represent a relation or providing other relevant clarifications. For sample
prompts, see [Sample Prompts for the Inventory Builder](https://help.sap.com/docs/leanix/ea/sample-prompts-for-inventory-builder?locale=en-US&state=PRODUCTION&version=CLOUD "Explore sample prompts to enhance your experience with the inventory builder.").

![Uploading the File and Providing Prompts for Analysis.](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2753ce3a7a44101494bad1f23aac03b9_LowRes.png)

6. Choose Analyze.

On the resulting page, you get an
overview of discovered fact sheets and relations.

7. To rerun the analysis, choose Analyze again and refine
the prompt.

8. When you're satisfied with the results, choose Push to
Inbox.

In the inbox, you can review the fact sheets and
relations in detail and decide whether you want to create them in your
workspace.


## Creating Fact Sheets and Relations from the Inventory Builder Inbox

The Discoveries tab in the inventory builder inbox lists all the
discovered fact sheets. Choose a fact sheet to view its details in the right-side
pane, including the source of discovery, suggested fact sheet relations, and whether
the fact sheet and its relations already exist or not. You can choose to either
review each discovered item individually to create fact sheets and relations or
create several fact sheets and relations at once.

![Inventory Builder Inbox](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2742061c7a441014b4deff7157fddbbd_LowRes.png)

Inventory Builder Inbox

## Individually Reviewing and Creating Fact Sheets and Relations

1. Chose a fact sheet to open the right-side panel.

2. Review the proposed fact sheets and relations. While reviewing, you can make the
following changes:


   - Link the discovered fact sheet to a different fact sheet than
     the suggested one: Hover over the suggested fact sheet,
     choose Edit, then search for and select an
     alternative fact sheet.

   - Reject a relation: Uncheck the check box against
     the relation you want to avoid creating.

   - Modify the target fact sheet of a relation: Hover
     over the suggested target fact sheet on the right, choose
     Edit, then search for and select a different
     fact sheet.


![LeanIX interface showing suggested fact sheets and relation options for review and editing.](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio65bc1654187a498d9f42f5feaa02b7ad_LowRes.png)

3. Choose Confirm at the bottom to create the fact sheets
and relations.


## Creating Fact Sheets and Relations for Multiple Items

1. In the inbox, use the checkboxes next to each item to select multiple fact
sheets from the list.

2. Choose Link at the top to create the fact sheets and
relations in bulk.


## Rejecting Discovered Items

You can reject fact sheets that you do not want to create. This helps you keep your list short
and find new fact sheets quickly.

To reject a fact sheet, select the item to open the right-side pane and choose
Reject Item at the bottom.

## Accessing Past Uploads and Analysis

To access past uploads and analyses, choose Inventory Builder - Import
Overview in the right-side pane of the inventory. From the import
overview, you can open the corresponding inbox for any item to continue reviewing
and creating fact sheets and relations.

The status of each file helps you track its progress in the inventory builder
workflow:

- Uploaded: File uploaded, but no further action was taken.

- Analyzed: File analyzed, but discovered items not yet added to the
inbox.

- Ready for review: Discovered items added to the inbox but not yet
reviewed.

- Reviewed: All discovered fact sheets and relations have been reviewed.
They were either added to the inventory or rejected.

- Error: Something went wrong while linking the discovery item to fact
sheets or creating its relations. Try to link or create the affected item
again.


## Best Practice Prompts for Using Inventory Builder Effectively

Using well-crafted prompts significantly improves the analysis of enterprise architecture
diagrams and images. This helps the inventory builder to accurately extract relevant
architectural elements for each fact sheet type.

To explore sample prompts for various fact sheet types, see [Sample Prompts for the Inventory\\
Builder](https://help.sap.com/docs/leanix/ea/sample-prompts-for-inventory-builder?locale=en-US&state=PRODUCTION&version=CLOUD "Explore sample prompts to enhance your experience with the inventory builder.").