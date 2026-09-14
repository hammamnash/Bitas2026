# SAP LeanIX

English

Provide feedback on our search



# MCP Server Toolsets

The SAP LeanIX MCP server exposes its capabilities as tools that AI agents can discover and invoke. Explore the available toolsets and learn how tools are loaded.

## Overview

The MCP server exposes API capabilities as discoverable tools that AI applications can invoke. Each tool includes structured metadata that describes inputs, outputs, and usage so that an AI agent can discover what the tool does and how to call it. Related tools are organized into toolsets — named collections that let you control what an agent sees in a single session.

The availability of tools depends on the authenticated user's permissions. For more
details, see [Permissions](https://help.sap.com/docs/leanix/ea/connecting-to-mcp-server?locale=en-US&state=PRODUCTION&version=CLOUD#loio19c0723e588e43519756d8bebf163048__section_by2_sh4_2hc).

## Default and Non-Default Toolsets

The SAP LeanIX MCP server includes default and non-default toolsets.

Default toolsets load automatically when an agent connects to the MCP server without explicit configuration.

Non-default toolsets are available on the MCP server but must be
requested explicitly. To load non-default toolsets, append
`?toolsets=<name>` to the MCP server URL. For example:



```
https://mcp.leanix.net/services/mcp-server/v1/mcp?toolsets=automations
```





## Tool Loading

By default, the MCP server loads all default toolsets at connection time. This can consume a large share of an LLM's context window and reduce agent performance, especially when an agent needs tools from only a few toolsets. Two strategies let you control which tools an agent loads per session: explicit toolset selection and progressive tool discovery. For a full comparison and setup instructions, see [MCP Tool Loading](https://help.sap.com/docs/leanix/ea/mcp-tool-loading?locale=en-US&state=PRODUCTION&version=CLOUD "The SAP LeanIX MCP server loads tools at connection time. You can control which tools an agent receives per session using explicit toolset selection, progressive tool discovery, or both.").

## Available Toolsets

The SAP LeanIX MCP server includes the following toolsets.

| Toolset | Provided by Default | Description |
| --- | --- | --- |
| `inventory` | Yes | Get fact sheet information. |
| `report_diagrams` | Yes | Get report and diagram information. |
| `roadmap_planning` | Yes | Get initiatives and transformation information. |
| `surveys` | Yes | Create or get survey information. |
| `architecture_decisions` | Yes | Create or get architecture decision information. |
| `self_built_software` | Yes | Create or get self-built software discovery information. |
| `get_insights` | Yes | Get architecture guidance insights. |
| `discovery_inbox` | No | Search, review, link, and reject discovery items across all discovery inboxes (SAP, SaaS, and AI agent). |
| `calculations` | No | Get, create, update, enable, disable, delete, and test calculations. |
| `automations` | No | Get, create, update, enable, disable, and delete automations.<br>See example scenarios in [Managing Automations with AI](https://help.sap.com/docs/leanix/ea/managing-automations-with-ai?locale=en-US&state=PRODUCTION&version=CLOUD "Manage automations with AI using the SAP LeanIX MCP server. No direct UI navigation is required."). |
| `catalogs` | No | Search the reference catalog and get catalog item information. |
| `custom_reports` | No | Get the data structure and guidance needed to build custom reports. |
| `product_information` | No | Get recent release communications, product roadmap items, and SAP Help Portal documentation for<br>SAP LeanIX. |





## Related Information

- [MCP Server](https://help.sap.com/docs/leanix/ea/mcp-server?locale=en-US&state=PRODUCTION&version=CLOUD "Connect external AI applications to SAP LeanIX using the Model Context Protocol (MCP) server to securely access enterprise architecture data."): Get an overview of the SAP LeanIX MCP server and learn how to get started.

- [Connecting to the MCP Server](https://help.sap.com/docs/leanix/ea/connecting-to-mcp-server?locale=en-US&state=PRODUCTION&version=CLOUD "Learn how to configure authentication settings and connect to the SAP LeanIX MCP server."): Endpoint URLs, authentication methods, and client configuration examples.

- [MCP Tool Loading](https://help.sap.com/docs/leanix/ea/mcp-tool-loading?locale=en-US&state=PRODUCTION&version=CLOUD "The SAP LeanIX MCP server loads tools at connection time. You can control which tools an agent receives per session using explicit toolset selection, progressive tool discovery, or both."): Comparison of tool-loading strategies and explicit toolset configuration.

- [Progressive Tool Discovery](https://help.sap.com/docs/leanix/ea/progressive-tool-discovery?locale=en-US&state=PRODUCTION&version=CLOUD "Progressive tool discovery is a workspace-level setting that significantly reduces token consumption. Instead of loading the full tool catalog upfront, the MCP server exposes tools only when an agent searches for them."): Reduce token consumption by loading tools on demand.