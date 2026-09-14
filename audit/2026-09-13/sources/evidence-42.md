# SAP LeanIX

English

Provide feedback on our search



# Technology Obsolescence Risk Statuses and Views in Reports

Learn how risk statuses are determined for IT components and applications and
understand reporting views, such as Missing Data Percentage, Mitigated Risk Percentage, and
Unaddressed Risk Percentage.

## Obsolescence Risk Statuses of IT Components

The table below lists risk statuses of IT components, from the highest to lowest
severity.

| Obsolescence Risk Status | Details |
| --- | --- |
| Unaddressed Risk | This status is assigned to an IT component when the internal<br>end-of-life date or vendor-provided end-of-support date is in<br>the past.<br>![](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio389fe81e890242a09b28be3dbb64a38e_LowRes.png)<br>Unaddressed Risk Status |
| Unaddressed Phase Out | If the phase-out date is in the past, an IT component always<br>receives the Unaddressed Phase Out<br>status, except when it also qualifies for Unaddressed<br>Risk status. In this case, the<br>Unaddressed Risk status takes<br>precedence because it represents a higher risk.<br>![](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loioe2e578e8d7614bcab6edcd79bb03ac54_LowRes.png)<br>Unaddressed Phase Out Status |
| Upcoming Risk | Despite having a vendor-provided end-of-support date in the<br>future, if the internal end-of-life information is not<br>documented, an IT component receives the Upcoming<br>Risk status, provided it doesn’t also qualify<br>for a higher risk status. Lack of internal end-of-life data is<br>not considered as upcoming risk information, as it means it is<br>still active.<br>![](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio3b250f3216984cab9347d2da0aa75e49_LowRes.png)<br>Upcoming Risk Status |
| Risk Accepted | If you mark the Obsolescence Risk Status<br>field on the relation between the IT component and application<br>fact sheet as Risk Accepted, it overrides<br>all other logic, and the IT component is assigned the<br>Risk Accepted status.<br>![Obsolescence Risk Status Field on the Relation Between IT Component and Application](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio27450c917a44101499cb87bbf357eef7_LowRes.png)<br>Obsolescence Risk Status Field on the Relation Between IT<br>Component and Application |
| Risk Addressed | If you mark the Obsolescence Risk Status<br>field on the relation between the IT component and application<br>fact sheet as Risk Addressed, it<br>overrides all other logic, and the IT component is assigned the<br>Risk Addressed status. |
| No Risk | If the vendor-provided end-of-support date is either in the<br>future or not provided, implying the component is still active,<br>and the internal end-of-life date is also in the future, then<br>the IT component is marked as having no risk. Likewise, if you<br>have not documented internal end-of-life and the vendor hasn't<br>provided one—implying it’s still active—then it is assigned the<br>No Risk status.<br>![](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio19f85a3fe48b4388a957f135a31711c7_LowRes.png)<br>No Risk Status |

Obsolescence Risk Statuses of IT Components





## Obsolescence Risk View Aggregation at the Application Level

The aggregated obsolescence risk is calculated based on the lifecycle status of the
underlying IT components that support your applications. The calculation for
aggregated obsolescence risk considers all IT components related to an application
in the following ways:

- Directly linked IT components: IT components that are directly linked to
the application via the `relApplicationToITComponent` relation and are active are
considered. Inactive relations are excluded; the 'active from/until' field in
the relation between IT components and applications determines the active or
inactive status.

- Indirectly linked IT components: These are IT components indirectly
connected to an application either through hierarchical relations `relToChild` between IT
components or as required/required by relations `relToRequires` between IT
components.

- Indirectly linked via other applications: IT components indirectly
connected to the application through another application with an active
hierarchical relation `relToChild` are also included in the risk assessment.

- Indirectly linked via system fact sheets: If your workspace
uses the system fact sheet, IT components that are indirectly connected to the
application through system fact sheets with an active
`relLxSystemSystemToITComponent` relation are also included
in the aggregated obsolescence risk assessment


The following order, from highest to lowest, indicates the severity of the risk
status of applications:

- Unaddressed Risk

- Unaddressed Phase Out

- Upcoming Risk

- Missing IT Component Information

- Risk Accepted

- Risk Addressed

- No Risk


![](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loiof75ab0a4baea47cdae1fc034adb13d37_LowRes.png)

Aggregation of Obsolescence Risk

## Obsolescence Risk Views

Technology Risk and Compliance offers
additional obsolescence views in reports to help analyze and monitor obsolescence
risks better.

- Obsolescence: Missing Data Percentage

- Obsolescence: Mitigated Risk Percentage

- Obsolescence: Unaddressed Risk Percentage View


Leveraging these views and other powerful reporting features, organizations can
comprehensively analyze technology obsolescence risks, prioritize them, and manage
them effectively.

## Missing Data Percentage

The missing data percentage view analyzes applications lacking lifecycle information,
displaying the percentage of IT components supporting each application without such
data. It helps you identify gaps in available information critical for risk
evaluation, enabling data completion efforts.

![Missing Data Percentage View](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2752b8917a441014ae5fb3fe16d2b3cc_LowRes.png)

Missing Data Percentage View

## Mitigated Risk Percentage

The mitigated risk percentage view lets you track your progress in mitigating risks
at the application level. It shows the percentage of IT components supporting each
application with Risk Accepted or Risk Addressed statuses in the
Obsolescence Risk Status field of the fact sheet. It helps you assess to
what extent you have addressed and reduced risks.

- Risk Accepted status indicates situations where you acknowledge the
risks of outdated software or hardware as low and acceptable despite their
persistence. This could apply to certain environments, such as testing or
legacy systems.

- Risk Addressed status indicates that the obsolescence risk was deemed
unacceptable, and you are taking required actions, such as technology
upgrades, migrating to another application or IT component, sunsetting the
application, and so on.



![Obsolescence Risk Status of IT Component](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2746acc37a4410149d02e8f2ab3f7430_LowRes.png)

Obsolescence Risk Status of IT Component


As a best practice, you would aim for 100% coverage of risk accepted or risk
addressed to comprehensively manage risk across your application portfolio.

![Mitigated Risk Percentage View](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2745a2f57a441014b13acedecabd0444_LowRes.png)

Mitigated Risk Percentage View

## Unaddressed Risk Percentage

The unaddressed risk percentage view helps prioritize and tackle risks that still
require attention. This view visualizes the percentage of IT components supporting
each application with lifecycle information in Phase Out or End Of Life.

![Unaddressed Risk Percentage View](https://help.sap.com/doc/72d375467c1e4dcb872dfa2998b6328d/CLOUD/en-US/loio2750d4317a441014bc95abc3a508ff03_LowRes.png)

Unaddressed Risk Percentage View