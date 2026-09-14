# SAP LeanIX

English

Provide feedback on our search



# Meta Model

Get an overview of the SAP LeanIX meta model and its key concepts.

This page gives you an overview of the core beliefs related to the SAP LeanIX meta model and basic concepts.

## Overview of the SAP LeanIX Meta Model

SAP LeanIX has a
best-practice meta model that provides a fast
time-to-value to start and maintain organizations' enterprise architecture work with
SAP LeanIX.
It includes best practices and knowledge from our work with more than 1,000
customers and gives clear guidance on documenting all elements of your
organization's enterprise architecture.

The SAP LeanIX
meta model is prescriptive: Our core belief is that using this meta model as a
standard will provide maximum efficiency and long-term success for companies'
enterprise architecture practices. Adopting this meta model will ensure the smooth
realization of all SAP LeanIX-recommended and -supported reporting and use case scenarios.

Although the meta model is fully configurable (explained in
detail below), any modifications to the meta model will affect all your SAP LeanIX
modeling practices, reporting, etc. This may result in limitations for future use
cases that might not be resolved efficiently or in a standardized way.

Overview of the SAP LeanIX
meta model with examples

![Overview of Meta Model](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio275732167a441014b56ed6ccf18304d6_LowRes.png)

## Layers of the SAP LeanIX Meta Model

The layers in the meta model are purely conceptual. They structure your enterprise
architecture into logical architecture domains from business strategy down to
technical execution. They do not impose any physical or technical separation, they
simply help understand and communicate your enterprise architecture. As such, you
will not find any references to these layers in the product itself.

- Business Architecture: Contains fact sheet types
organization, business capability, and business context.

- Application & Data Architecture: Contains fact sheet
types data object, application, and interface.

- Technical Architecture: Contains fact sheet types
provider, IT component, and tech category.


The Strategy & Transformation layer spans across the
entire meta model and all architecture layers. It contains fact sheet types
objective, platform, and initiative.

## Fact Sheet Types

The fundamental building blocks of the SAP LeanIX meta
model are called fact sheet types. By default there are 12
different fact sheet types in the meta model v4 as detailed below. On the type
level, relations, attributes, subscriptions, tags, access, and more are defined.

Relations between fact sheets define how different architectural elements are
connected to each other. They describe who uses what, depends on what, and supports
what across your enterprise architecture.

For example:

- A business capability is supported by an application

- An application runs on an IT component

- An organization uses an application

- An application interfaces with another application


These relations are the basis for all the reports and allow you to analyze
impact of changes, dependencies, risks, redundancies and more.

![Default and Optional Fact Sheet Types and Subtypes with Relations](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio9a55740e53fc4cf7a6fa6c054b13bc77_LowRes.png)

Default and Optional Fact Sheet Types and Subtypes with Relations

| Fact Sheet Type | Meta Model Layer | Definition | Details |
| --- | --- | --- | --- |
| Objective | Strategy and Transformation | Objectives capture the goals that your organization aims to<br>achieve. These drive initiatives to improve business<br>capabilities and transform the IT landscape. | [Objective Modeling Guidelines](https://help.sap.com/docs/leanix/ea/objective-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model objectives. This includes best practices and applicable use cases, and common antipatterns.") |
| Platform | Strategy and Transformation | Platforms are groupings of business capabilities, applications,<br>and technologies that provide common functionalities. | [Platform Modeling Guidelines](https://help.sap.com/docs/leanix/ea/platform-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model platforms. This includes best practices and applicable use cases, and common antipatterns.") |
| Initiative | Strategy and Transformation | Initiatives capture the planned projects or programs within your<br>organization that impact its enterprise architecture and are<br>aimed at achieving specific goals or objectives. | [Initiative Modeling Guidelines](https://help.sap.com/docs/leanix/ea/initiative-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model initiatives. This includes best practices and applicable use cases, and common antipatterns.") |
| Organization | 1\. Business Architecture | Organizations represent your organization's hierarchical business<br>architecture, detailing departments and teams. | [Organization Modeling Guidelines](https://help.sap.com/docs/leanix/ea/organization-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model organizations. This includes best practices and applicable use cases, and common antipatterns.") |
| Business capability | 1\. Business Architecture | Business capabilities (also called domains) model what your<br>applications do to support your business goals. | [Business Capability Modeling Guidelines](https://help.sap.com/docs/leanix/ea/business-capability-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "This page covers modeling guidelines for business capabilities. Learn about best practices and applicable use cases, and avoid common antipatterns.") |
| Business context | 1\. Business Architecture | Business contexts capture the specific activities your<br>organization performs to achieve its business goals. | [Business Context Modeling Guidelines](https://help.sap.com/docs/leanix/ea/business-context-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model business contexts. This includes best practices and applicable use cases, and common antipatterns.") |
| Data Object | 2\. Application and Data Architecture | Data objects provide an overview of general data processed and<br>exchanged by specific applications. | [Data Object Modeling Guidelines](https://help.sap.com/docs/leanix/ea/data-object-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model data objects. This includes best practices and applicable use cases, and common antipatterns.") |
| Application | 2\. Application and Data Architecture | Applications are the software systems or programs that process or<br>analyze business data to support business tasks, processes, or<br>aspects of your organization's business model. They are the<br>central entities in SAP LeanIX because they link business and<br>IT. | [Application Modeling Guidelines](https://help.sap.com/docs/leanix/ea/application-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "This page guides you on modeling applications, covering subtypes, best practices, versioning, hierarchies, and use cases. Avoid common antipatterns and gain valuable insights.") |
| Interface | 2\. Application and Data Architecture | Interfaces are the connections between applications that<br>illustrate how data exchange occurs. | [Interface Modeling Guidelines](https://help.sap.com/docs/leanix/ea/interface-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model interfaces. This includes best practices and applicable use cases, and common antipatterns.") |
| Provider | 3\. Technical architecture | Providers are the companies or entities that supply IT solutions,<br>services, or technologies to support your organization in<br>achieving its objectives and operational efficiency. | [Provider Modeling Guidelines](https://help.sap.com/docs/leanix/ea/provider-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model providers. This includes best practices and applicable use cases, and common antipatterns.") |
| IT component | 3\. Technical architecture | IT components represent the technology or services that your<br>applications depend on. They can provide information on both<br>development and operations. They are used to model operating<br>costs as well as technological risks. | [IT Component Modeling Guidelines](https://help.sap.com/docs/leanix/ea/it-component-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model IT components. This includes best practices and applicable use cases, and common antipatterns.") |
| Tech category | 3\. Technical architecture | Tech categories are used to group IT components into different<br>categories of technology. | [Tech Category Modeling Guidelines](https://help.sap.com/docs/leanix/ea/tech-category-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model tech categories. This includes best practices and applicable use cases, and common antipatterns.") |
| System | 3\. Technical architecture | Systems represent the technical environment underlying<br>applications, such as a server or virtual machine with its<br>operating system, database, runtime configurations, and<br>more. | [System Modeling Guidelines](https://help.sap.com/docs/leanix/ea/system-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Modeling guidelines, best practices, use cases, and recommendations for system fact sheets.") |
| Data Product | 2\. Application and Data Architecture | Represents governed, packaged, reusable data assets that are<br>designed to be shared and consumed for business purpose. | [Data Product Modeling Guidelines](https://help.sap.com/docs/leanix/ea/data-product-modeling-guidelines?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to model data products. This includes best practices, applicable use cases, and common antipatterns.") |
|  |  | Enables tracking of vendor agreements, financial commitments,<br>renewal dates, and lifecycle phases for IT contracts. | [Contract Extension to the Meta Model](https://help.sap.com/docs/leanix/ea/contract-extension-to-meta-model?locale=en-US&state=PRODUCTION&version=CLOUD "Track your organization's IT vendor contracts and financial commitments with the dedicated contract fact sheet type.") |





## Fact Sheet Subtypes

Fact sheet subtypes are subcategories within fact sheet types that subclassify
architectural elements, each focusing on distinct aspects. While subtypes share
common properties with other subtypes, they also have unique attributes and
relationships.

When you create a fact sheet for which a predefined subtype is available, we
recommend assigning a subtype even though you can also leave it unassigned by
selecting n/a.

To learn how to create fact sheet subtypes manually, see [Add Fact Sheet Subtypes](https://help.sap.com/docs/leanix/ea/configure-workspace-meta-model-v4?locale=en-US&state=PRODUCTION&version=CLOUD#loio27595ce97a4410149c60a90e0f529a04__add_fact_sheet_subtypes_to_several_fact_sheet_types).

| Fact Sheet Type | Subtype | Availability |
| --- | --- | --- |
| Application | Business Application | Default (in new workspaces created after May 11, 2026) |
| AI Agent | Default (in new workspaces created after May 11, 2026) |
| Microservice | Optional |
| Business Context | Customer Journey | Default |
| Process | Default |
| Business Product | Default |
| Value Stream | Default |
| ESG Capability | Optional |
| Initiative | Idea | Default |
| Program | Default |
| Project | Default |
| Epic | Default |
| Interface | API | Default |
| Logical Interface | Default |
| MCP Server | Default (in new workspaces created after May 11, 2026) |
| IT Component | SaaS | Default |
| IaaS | Default |
| PaaS | Default |
| Software | Default |
| Hardware | Default |
| Services | Default |
| AI Model | Default (in new workspaces created after October 29,<br>2025) |
| Organization | Business Unit | Default |
| Customer | Default |
| Region | Default |
| Legal Entity | Default |
| Team | Default |





## Is the SAP LeanIX Meta Model Configurable?

Yes, the SAP LeanIX meta
model is fully configurable. However, we recommend that you work with the 12
provided fact sheet types as they have been proven across industries to represent an
organization's enterprise architecture best and support standardization,
collaboration, and simplification - which SAP LeanIX
stands for. Using the out-of-the-box meta model will help you implement best
practices for lean Enterprise Architecture Management, saving you time and making
internal documentation and enablement in your organization easier. Especially for
organizations with lower EA maturity, it is recommended to stick to standards and
best practices to streamline efforts and ensure a less disruptive EA journey. If you
plan to customize your meta model, seek the support of SAP LeanIX to
get guidance on how to map the meta model best to suit your organization's
requirements.

To learn how to configure the meta model, see [Meta Model Configuration](https://help.sap.com/docs/leanix/ea/meta-model-configuration?locale=en-US&state=PRODUCTION&version=CLOUD "Configure the meta model to adjust it to your requirements.").

## Are Fact Sheet Subtypes Configurable?

We're refining several roadmap
items, which aim to bring the current configuration capabilities on fact sheet types
to subtypes. Examples include configuring conditional fields, configuring subtypes,
configuring the authorization model for subtypes, and supporting the renaming of
fact sheet types.

## Is Moving from the Meta Model v3 to the Meta Model v4 Necessary?

You do
not have to do anything if you use the [SAP LeanIX\\
Meta Model v3](https://help.sap.com/docs/leanix/ea/meta-model-v3?locale=en-US&state=PRODUCTION&version=CLOUD). As SAP LeanIX customers, you own your meta model and can
decide whether to adopt the meta model v4 (or parts of it). With the support of your
CSM, you can decide whether re-using the new predefined subtypes is the right
approach from now on, in which case the new subtypes can be created / or simply by
changing the fact sheet labels.

The meta model v4 has some advantages and will provide better clarity on modeling
topics (for example, platforms, products, and business architecture).