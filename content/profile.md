---
name: Damian Sińczak
title: Modernizing legacy applications with brain-powered AI
headlineInfo: Throughout my career, I've always worked with legacy systems to varying degrees. Over time, what initially seemed like a curse became a blessing and a lifelong learning experience. Now, thanks to AI and my experience, I'm able to quickly and precisely collaborate with even the most stubborn codebases, maintaining, developing, and modernizing them.
location: Łódź, Poland
email: damian.sinczak@gmail.com
phone: "+48 728 866 012"
assets:
  photo:
    src: content/profile_pic.jpg
    alt: Damian Sińczak
    position: center
  banner:
    src: content/banner.jpeg
    alt: Code editor close-up
    position: center
links:
  linkedin: https://www.linkedin.com/in/dsinczak
  github: https://github.com/dsinczak
pdf:
  filename: Damian_Sinczak_CV.pdf
  website: https://www.damiansinczak.dev
seo:
  # `title` above is a positioning tagline. This is the occupation a person
  # actually types into a search box, and it is what lands in <title>,
  # og:title and schema.org Person.jobTitle.
  jobTitle: Senior Software Engineer & Architect
  # <meta name="description">. Google truncates around 155 characters, so this
  # is written to fit rather than being cut mid-sentence from headlineInfo.
  description: Senior software engineer and architect. 17 years modernizing legacy JVM systems — Java, Clojure, Scala — with AI-assisted engineering. Łódź, Poland.
  # Broader topics for schema.org Person.knowsAbout. Merged ahead of the
  # concrete technologies listed in the Skills section.
  knowsAbout:
    - Legacy system modernization
    - Software architecture
    - Distributed systems
    - AI-assisted software engineering
    - LLM tooling and agents
---

# Bio

I’m a senior software engineer and architect with 17 years of experience building and modernizing backend systems across fintech, banking, automotive, telecommunications, and data-intensive platforms. Most of my career has been spent in the JVM ecosystem, particularly Java, Scala and Clojure, working with distributed systems, cloud infrastructure, and the messy reality of legacy software.

AI-assisted engineering is now part of my everyday work, not a side experiment. I use tools such as GitHub Copilot and OpenCode extensively throughout the SDLC: understanding unfamiliar code, exploring designs, implementing and refactoring features, writing tests, reviewing changes, troubleshooting problems, and producing documentation. This hands-on experience has led me deeper into applied AI product engineering, including LLM tooling, agents, evaluation workflows, context and memory systems, automation, and AI-native product experiences.

I bring a systems engineering mindset to AI, with a strong focus on reliability, observability, data flow, feedback loops, and the production infrastructure required to make these tools work consistently. I enjoy digging into difficult problems, asking awkward but necessary questions, and finding solutions that hold up in production.

# Experience

## Vertex Inc.
<!-- target: all; web: expanded -->

Icon: content/vertex_inc_logo.jpeg
Role: Senior Clojure/Java Developer - Contract
Period: June 2021 - Present
Location: King of Prussia, PA / Remote

- Joined Taxamo as a senior engineer and quickly became productive in Clojure, contributing across the full software development lifecycle.
- Helped integrate Taxamo’s indirect-tax product into the Vertex platform following its 2021 acquisition, including integration with the OSeries tax calculation engine.
- Extended a high-volume reporting service to support Snowflake alongside AWS Athena, translating platform-specific behavior while preserving reporting consistency.
- Extracted reporting capabilities from a 25-year-old monolith into a scalable, multitenant service. Delivered the first production release within six months while acting as the primary developer.
- Currently consolidating Taxamo reporting into the shared Vertex reporting platform, giving products across the portfolio a consistent reporting experience.

:::detail target="web" web="collapsed" label="More info"
I joined Taxamo, an Irish tax-technology company serving marketplaces and businesses selling internationally, as a senior software engineer. Its product was built in Clojure, a language I had never used professionally. My Java, JVM, and Scala background gave me a solid foundation, but learning Clojure and its ecosystem still required a significant shift in how I approached software design. I became productive quickly and eventually shared that experience with the local Java community through a talk introducing Clojure.

Startup life meant working across the full SDLC rather than staying inside a narrow development role. I contributed to design, implementation, testing, delivery, production support, and whatever else was needed to move the product forward.

Vertex completed its acquisition of Taxamo on June 30, 2021. We then began the long and technically demanding process of bringing Taxamo into the Vertex platform and integrating it with OSeries, Vertex’s established tax calculation engine. That work required adapting a standalone product to a much larger platform without losing the behavior its customers depended on.

My systems design knowledge, Java, and JVM experience gradually took me beyond the original Taxamo product. I contributed to OSeries itself, where working through decades of accumulated business rules confirmed that legacy systems are very much my sweet spot.

I later extended a high-volume reporting service built around AWS Athena to support Snowflake, Vertex’s chosen data platform. The challenge was not simply connecting another database: it required understanding Athena-specific assumptions and reproducing the relevant behavior in the Snowflake domain.

My next assignment was extracting reporting functionality from a 25-year-old monolith into a standalone service. The new system had to be multitenant, scalable, backed by Snowflake rather than the monolith’s mixture of databases, and still behave exactly like the original. Acting as the primary developer for most of the project, I delivered its first production deployment within six months. The service now supports new reports, customer-facing APIs, and workflows orchestrated with Temporal.

I currently work across the Taxamo and reporting teams, moving Taxamo reports onto this shared service so products throughout the Vertex platform can offer a consistent reporting experience.
:::

## AVILOO
<!-- target: all; web: expanded -->

Icon: content/aviloo_logo.jpeg
Role: Yoda Java Engineer - Contract
Period: October 2020 - June 2021
Location: Vienna, Austria

- Built core capabilities for AVILOO’s independent EV battery diagnostic platform, working across development, analysis, deployment, and testing with real vehicles.
- Developed mechanisms for collecting and storing vehicle data, performing multistage battery analysis, and detecting potentially fraudulent tests.
- Delivered customer-facing and back-office interfaces supporting the complete battery-testing workflow.
- Worked extensively with Java and Project Reactor on a reactive platform processing high-volume telemetry from electric vehicles.
- Took end-to-end ownership across the SDLC in a fast-moving startup environment, from initial design to production operation.

:::detail target="web" web="collapsed" label="More info"
I joined AVILOO while it was still an early-stage Austrian startup working to make the condition of an electric vehicle’s most valuable component measurable and understandable. Its manufacturer-independent diagnostics transform raw battery data into an objective assessment that helps individuals and businesses make informed decisions when buying, selling, or managing electric vehicles.

AVILOO had the atmosphere people usually associate with startup films, except it was real. Its headquarters operated from a garage that brought together founders, office staff, software engineers, and the people physically disassembling and examining batteries. Although I worked primarily from Poland, my visits made the company’s energy tangible: the founders were deeply involved, the team understood the goal, and people genuinely believed in what they were building.

My work reflected that environment. I participated in the entire product lifecycle, including requirements analysis, system design, implementation, deployment, production support, and testing with real cars. There was little separation between “writing the software” and making sure the complete product actually worked.

I built several core parts of the battery-testing platform from scratch. These included vehicle-data collection, a purpose-built data store developed within the team, multistage battery analysis, and mechanisms for identifying potentially fraudulent tests. I also developed customer-facing (used to conduct tests, inspect their progress, and work with the resulting analysis) and back-office interfaces.

The platform was built as a reactive system using Java and Project Reactor, processing substantial streams of telemetry generated during vehicle tests. Working deeply with this architecture taught me both the strengths and the considerable complexity of reactive systems under real production workloads.

More than any specific technology, AVILOO shaped my understanding of software engineering as end-to-end ownership. A software engineer’s responsibility does not stop when the code compiles or a ticket reaches “done”; it extends through deployment, operation, and observing whether the product works in the hands of real people and, in this case, real cars.
:::

## Luminor Latvija
<!-- target: all; web: expanded -->

Icon: content/luminorlatvija_logo.jpeg
Role: Technical Leader - Contract
Period: April 2020 - October 2020
Location: Łódź / Remote

- Developed retail and commercial banking services during Luminor’s consolidation of the former DNB and Nordea Baltic operations onto a shared AWS platform.
- Worked across reactive financial workflows, integrations with mainframe transaction-processing systems, and Kubernetes-based application delivery.
- Standardized Spring configuration and deployment practices across multiple applications, bringing them closer to the 12-factor application model.
- Refactored Project Reactor services to establish consistent reactive-programming patterns across teams.
- Introduced shared application-resilience standards using Resilience4j, including circuit breakers, retries, and bulkheads.

:::detail target="web" web="collapsed" label="More info"
I joined Luminor through Tameshi, an AWS-focused cloud consultancy specializing in migration, operations, security, compliance, and platforms for financial institutions. My background was primarily in software development, but a growing interest in DevOps and cloud engineering made the assignment a natural fit.

Luminor had been formed by combining the Baltic operations of DNB and Nordea. I joined while the bank was still consolidating their systems and building a shared platform for retail and commercial banking on AWS. New cloud-native services had to coexist with substantial legacy infrastructure, including mainframe systems responsible for transaction processing.

I worked in one of the development teams, but the transition exposed me to almost every layer of the platform. Depending on the problem, I could be working on high-volume currency-processing workflows using reactive technologies, integrating with mainframe systems, or investigating how an application behaved after deployment to Kubernetes on AWS.

Because I came through a company focused on cloud platforms, I naturally became a liaison between development and DevOps teams. I understood what application developers needed, but I was equally interested in deployment, configuration, observability, and how software behaved in production. That position between the two disciplines became one of the parts of the role I enjoyed most.

I standardized Spring configuration and deployment practices across multiple applications, moving them closer to the 12-factor application model and reducing differences between services and environments. I also refactored several Project Reactor applications to establish a more consistent approach to reactive programming.

My largest initiative was introducing common application-level resilience patterns with Resilience4j and its Spring integration. Circuit breakers, retries, bulkheads, and related mechanisms had previously been handled inconsistently. Establishing shared patterns gave teams a clearer and more predictable way to build services that could tolerate failures across a distributed banking platform.
:::

## IDEMIA
<!-- target: all; web: expanded -->

Icon: content/idemiagroup_logo.jpeg
Role: System Architect
Period: February 2019 - May 2020
Location: Łódź, Poland

- Led the architecture of a GSMA TS.43-aligned platform for activating and managing mobile-network services, including companion devices such as smartwatches.
- Designed secure, operator-agnostic processes that met GSMA requirements while accommodating different mobile operator systems and integration models.
- Helped pioneer AWS adoption within IDEMIA, shaping the application’s deployment, security, observability, and testing practices.
- Designed an internal chaos-testing framework that injected AWS infrastructure failures and verified the platform’s resilience in lower environments.
- Guided the project from early development toward production readiness as its system architect.

:::detail target="web" web="collapsed" label="More info"
I returned to IDEMIA as the system architect for a project that was already under development but had not yet been tested with a real customer or deployed beyond development environments.

The product implemented service-entitlement processes aligned with the GSMA TS.43 specification. It enabled mobile operators to activate and manage network services on customer devices, including companion-device scenarios such as connecting a smartwatch to a subscriber’s mobile service. Although the business workflows appeared relatively simple, integrating them securely and consistently with different operators made the system considerably more complex.

My responsibility was to design processes that satisfied the GSMA specification and IDEMIA’s security requirements while keeping the platform flexible enough to integrate with operators whose infrastructure, authentication mechanisms, and operational constraints varied significantly.

The project was also one of IDEMIA’s early AWS-based applications. That gave us room to explore cloud deployment, infrastructure automation, observability, security, performance testing, and resilience rather than merely moving an existing architecture onto virtual machines.

We eventually developed our own chaos-testing framework for lower environments. It used AWS APIs to inject infrastructure failures and then observed how the application recovered and whether its behavior remained correct. This allowed us to test failure scenarios deliberately instead of waiting for production to teach us the hard way.

The role brought together standards-driven system design, telecommunications security, cloud architecture, and production readiness. It also reinforced a lesson I have carried into later work: resilience cannot be added at the end of development; it has to be designed and tested as part of the system.
:::

## HARMAN International
<!-- target: all; web: expanded -->

Icon: content/harman_international_logo.jpeg
Role: Principal Engineer
Period: August 2018 - January 2019
Location: Łódź, Poland

- Led a six-person engineering team developing an in-vehicle connectivity service for Volkswagen’s MEB electric-vehicle platform.
- Designed bidirectional communication between vehicle systems and Volkswagen’s backend, supporting remote commands and exposing vehicle status to drivers.
- Modelled the service as a finite-state machine and designed a vehicle-independent test environment.
- Improved communication with other ECUs to tolerate transient failures, retries, and device restarts.
- Presented the architecture, implementation, documentation, and test strategy to Volkswagen’s infotainment architects.

:::detail target="web" web="collapsed" label="More info"
I joined HARMAN as a Principal Engineer leading a team of six. We worked on an infotainment-layer service running on an electronic control unit within Volkswagen’s MEB architecture, the platform developed for electric vehicles including the ID family.

Our component connected the vehicle with Volkswagen’s online services. In one direction, it received commands initiated by drivers through the user portal, such as activating heating or lights. In the other, it collected information from systems throughout the vehicle and made the resulting state available through the same portal.

We designed the service from scratch around a finite-state machine. Vehicle connectivity is inherently unreliable: network access disappears, ECUs restart, messages arrive late, and dependent components may be temporarily unavailable. We therefore designed communication flows to survive retries, partial failures, interrupted operations, and device restarts without losing or corrupting state.

The team also built a vehicle-independent testing approach that allowed us to exercise the service without requiring access to a physical car for every development and test cycle. We supported the design with implementation, automated tests, and documentation before presenting the complete proposal to Volkswagen’s infotainment architecture group.

The architecture group ultimately chose to retain and adapt code from the established MQB platform rather than adopt our replacement. The decision prioritized continuity with the existing vehicle architecture, despite the technical and cost advantages we believed our approach offered. The team consequently shifted from developing the new design to modifying the legacy implementation.

That change explains my short time at HARMAN. The role gave me valuable experience with automotive systems, AUTOSAR environments, embedded constraints, and communication between in-vehicle components. It also gave me a direct lesson in a less technical part of architecture: a sound design does not succeed on engineering merit alone. Organizational incentives, perceived migration risk, and ownership of existing systems can outweigh technical arguments.
:::

## IDEMIA
<!-- target: all; web: collapsed -->

Icon: content/idemiagroup_logo.jpeg
Role: Senior Software Engineer
Period: February 2017 - July 2018
Location: Lodz, Lodz District, Poland

- Developed SM-DP and SM-SR components implementing the GSMA M2M eSIM remote-provisioning architecture.
- Worked on secure preparation, delivery, and lifecycle management of operator profiles for remotely deployed eUICCs.
- Designed cryptographic and key-management workflows backed by hardware security modules in IDEMIA’s private data center.
- Addressed HSM throughput constraints through asynchronous processing, queuing, and Akka-based concurrency.
- Improved the resilience and recoverability of stateful provisioning workflows where data loss could leave remote devices unreachable.
- Learned Scala and functional programming while helping move the platform onto Kubernetes in IDEMIA’s private cloud.

:::detail target="web" web="collapsed" label="More info"
I first joined IDEMIA as an experienced Java developer hired to learn Scala for a new assignment. The project had originated in IDEMIA’s Philippine branch and was transferred to Poland when that operation was partially closed. We inherited both a working foundation and a codebase that required considerable improvement.

The platform implemented the GSMA M2M architecture for remotely provisioning and managing eSIM profiles. Its SM-DP component prepared and cryptographically protected operator profiles, while SM-SR provided secure communication with eUICCs and managed profile delivery and lifecycle operations. This allowed operators to provision subscriptions and later switch them remotely without replacing a physical SIM.

The project was challenging on several fronts. eSIM was only beginning to reach the wider market, the domain was governed by a detailed security specification, and the application was being deployed on Kubernetes in IDEMIA’s private data center when that technology was still relatively new in the organization.

Security was part of the application’s core behavior rather than a layer added around it. Communication between operators, subscription-management services, and eUICCs involved several levels of encryption, authentication, certificate handling, and cryptographic key establishment. I worked on these flows using hardware security modules hosted in the private data center.

HSM throughput became one of the system’s principal constraints. We had to design asynchronous processing and queuing mechanisms that used the available cryptographic capacity efficiently without compromising operation ordering or security. Akka and its actor model gave us a strong foundation for coordinating this concurrent, stateful work.

Reliability carried unusually high stakes. Provisioning operations consisted of multiple dependent steps, and losing state at the wrong moment could leave the platform unable to communicate with an embedded SIM. For remotely deployed devices, that could ultimately require physical replacement. We therefore treated durable state, idempotency, recovery, and high availability as fundamental parts of the design.

This was also my introduction to Scala and serious functional programming. After years of Java, Scala changed how I thought about state, composition, concurrency, and software design. Working with Akka reinforced that shift and influenced how I approached distributed systems long after leaving the project.

Just as importantly, I worked alongside engineers who were early adopters of Scala, Akka, Kubernetes, and disciplined engineering practices in the local market. The project significantly raised my standards for problem-solving, documentation, automated testing, security, and professional software development.
:::

## Commerzbank Digital Technology Centre Poland
<!-- target: all; web: expanded -->

Icon: content/commerzbank_branch_in_poland_logo.jpeg
Role: Software Engineer
Period: February 2015 - January 2017
Location: Lodz, Lodz District, Poland

- Joined CERI as the first software engineer in a pilot intended to establish software-development capabilities for Commerzbank in Poland.
- Took ownership of a legacy cash-logistics platform supporting cash inventories, orders, deliveries, service contracts, and forecasting for German branches and self-service devices.
- Stabilized and modernized an old Ant-based Java application, building the test coverage needed to change it safely.
- Helped turn the pilot into a larger engineering operation by earning stakeholder trust, growing the local team, and taking ownership of additional projects from Germany.
- Applied Domain-Driven Design to understand a complex banking domain and guide the application’s gradual modernization.


:::detail target="web" web="collapsed" label="More info"
I joined CERI, a Polish Commerzbank subsidiary providing back-office services, as the first software engineer in a pilot project. The immediate objective was to take ownership of a Commerzbank application, but the broader goal was to prove that the Polish organization could expand from operational services into software engineering.

The application managed cash logistics for Commerzbank’s German branch and self-service network. Its responsibilities included modelling ATMs, cash-deposit machines, and cash-recycling devices; tracking cash balances; coordinating deliveries and supplier contracts; and handling cash orders, including those involving the German central bank. It also forecast when and where cash would be required based on historical usage, schedules, and calendar events.

The system was old, complex, and still built with Ant. Before making substantial functional changes, I had to understand undocumented business rules, stabilize the build, introduce tests around existing behavior, and create enough confidence to modernize it incrementally without disrupting critical banking operations.

The effort paid off beyond the application itself. Commerzbank’s stakeholders gained confidence in the Polish team, I was able to recruit additional engineers, and we gradually took ownership of further projects from Germany. What began as a one-person experiment became evidence that CERI could provide full software-engineering services.

This was also where I developed a serious interest in Domain-Driven Design. Training gave me the vocabulary, but the cash-logistics system supplied the real lesson: complex software cannot be improved safely until its business language, boundaries, and hidden rules are understood. I continued developing that approach throughout my later career.

More than any clean greenfield project could have done, this system taught me how to work with legacy software: establish observable behavior, recover domain knowledge, make small defensible changes, and earn the right to modernize. It was difficult work, but it became the foundation of what is now one of my strongest engineering specialities.
:::

## TomTom
<!-- target: all; web: expanded -->

Icon: content/tomtom_logo.jpeg
Role: Senior Software Engineer
Period: August 2013 - January 2015

- Developed large-scale pipelines for converting TomTom map data into automotive navigation formats.
- Designed divide-and-conquer workflows that partitioned geographic data, processed independent layers concurrently, and merged dependent results in the correct order.
- Worked with complex geospatial data using Java, Spring, PostgreSQL, PostGIS, and JTS.
- Helped adapt map-conversion applications during TomTom’s transition from file-based map data toward a shared, continuously updated platform.
- Built distributed batch-processing workflows with Hadoop and Apache Crunch for very large map datasets.

:::detail target="web" web="collapsed" label="More info"
I joined TomTom as a contractor from Cybercom and worked on two projects involving large-scale map processing and conversion.

The first converted maps from TomTom’s internal format into an automotive navigation format used by Harman systems. The pipeline was built primarily with Java, Spring, PostgreSQL, PostGIS, and JTS. Its central design followed divide and conquer: geographic data was repeatedly partitioned into smaller jobs, processed, and merged into the final product.

Coordinating that work was more complicated than simply running every task in parallel. Some map layers could be processed independently, while others depended on completed layers or required results from neighbouring regions. The system therefore had to manage a graph of spatial and processing dependencies while handling large volumes of data efficiently.

This project gave me an unexpected education in road topology, geometry, coordinate systems, and the mathematics behind digital maps. It also demonstrated how much specialist domain knowledge sits behind a navigation product that appears simple to its users.

The application was developed for a tender involving a German automotive manufacturer and was designed to satisfy a demanding set of requirements. TomTom ultimately did not win the contract, so I moved to another map-processing project.

I joined the second project during a significant technical transition. TomTom was moving away from exchanging large, file-based map snapshots toward a platform that supported incremental changes and consistent programmatic access. A broad collection of existing applications still converted the old source format into customer-specific products, and those pipelines had to be adapted to the new model.

At the same time, TomTom was experimenting with the emerging big-data ecosystem. I worked with Hadoop and Apache Crunch to build distributed pipelines capable of processing very large map datasets. This gave me practical experience with data partitioning, dependency management, parallel execution, and failure handling long before such patterns became routine in mainstream backend development.

The company was also moving toward Agile delivery at scale. Over roughly a year, I worked with experienced coaches and facilitators while teams adopted Scrum and broader scaled practices. That experience gave me a lasting understanding of both what Agile can achieve and how easily its ceremonies can become disconnected from its principles.
:::

## Comarch
<!-- target: all; web: expanded -->

Icon: content/comarch_logo.jpeg
Role: Mobile Android Developer
Period: January 2012 - June 2013

- Researched Android as an emerging enterprise platform and built the initial native mobile application for Comarch’s Field Service Management product.
- Led the application from proof of concept to a full-scale product for managing technicians’ work orders, resources, and on-site equipment tests.
- Acted as technical lead and hands-on developer, owning the mobile architecture, implementation, and development planning.
- Conducted on-site workshops with existing and prospective customers to understand field-service workflows and deployment constraints.
- Translated customer requirements into HLD and LLD documentation and an architecture capable of supporting future implementations.

:::detail target="web" web="collapsed" label="More info"
After completing my work on Nokia Life Tools, I moved to Comarch’s Field Service Management product. The platform coordinated fleets of field technicians, the work assigned to them, and the equipment and other resources required to complete it. Its backend already existed and was being deployed for its first customer, but it did not yet have a modern mobile client.

Android was still an emerging platform, and my first assignment was to research whether it could support Comarch’s enterprise mobility needs. I then built a proof of concept for a native application that field technicians could use to receive and manage work orders, track resources, and perform basic tests on equipment installed at customer sites.

The application began with a limited smartphone scope, but a successful demonstration turned it into a full product initiative. As technical lead and developer, I designed its architecture, planned the work, and remained directly involved in implementation while the team built up its Android expertise.

The product requirements were still evolving, so architecture could not be separated from understanding how technicians actually worked. I visited existing and prospective customers, gathered requirements on site, and translated their operational processes and deployment constraints into HLD and LLD documents. The resulting design had to satisfy the first implementations without locking the application into a single customer’s way of working.

This role was my first sustained experience of connecting product discovery, customer communication, architecture, documentation, and delivery. It taught me that a useful mobile application is shaped as much by the environment in which people use it as by the technology chosen to build it.
:::

## Comarch
<!-- target: all; web: expanded -->

Icon: content/comarch_logo.jpeg
Role: Software Developer
Period: March 2009 - March 2012

- Began my professional career through Comarch’s paid internship program, delivering a backend-controlled update proof of concept for a Windows Mobile CRM application.
- Worked as a backend developer on the deployment of Comarch’s CRM platform for wRodzinie, a newly established Polish mobile virtual network operator.
- Designed and implemented billing and reconciliation capabilities for Nokia Life Tools, supporting one-time purchases and subscriptions.
- Integrated with widely varying mobile-operator systems through FTP and flat files, SOAP services, messaging, and synchronous and asynchronous payment workflows.
- Combined analysis, architecture, development, and on-site delivery across Asia and Africa before expanding into the Nokia Life Tools content-management and delivery platform.

:::detail target="web" web="collapsed" label="More info"
Comarch was my first employer. I joined through a three-month paid internship, where my assignment was to create a proof of concept for remotely updating one of Comarch’s Windows Mobile applications. The work covered the complete path from backend orchestration to installation on the device, allowing updates to be controlled by Comarch’s platform. The successful prototype informed later releases of a mobile client for the company’s CRM product.

After the internship, I joined Comarch’s telecommunications division as a backend developer. My first commercial assignment was implementing the company’s CRM platform for wRodzinie, a newly established Polish mobile virtual network operator.

I then joined a pilot project for Nokia Life Tools. We built a billing and reconciliation system for content sold through one-time purchases and subscriptions. Its business domain was relatively straightforward; integration with mobile operators was not. Depending on the operator, we exchanged FTP files, called different SOAP services, communicated through queues, or combined synchronous requests with asynchronous status checks constrained to specific processing windows.

Those differences quickly made on-site collaboration necessary. I worked with operators and hosting providers in India, Indonesia, China, Nigeria, and Vietnam, establishing the initial technical communication, gathering requirements, documenting each integration, and helping implement and deploy the application locally.

After several successful deployments, Nokia expanded our responsibilities to include the content-management and delivery side of Nokia Life Tools. The service delivered useful information, including local agricultural prices, to inexpensive phones without internet access through an application communicating over binary SMS. It was technically inventive, but its real value was making information accessible in places where smartphones and mobile data were not yet realistic options.

The broader program involved 17 people across three time zones, with cooperation between Nokia’s headquarters in Finland, its R&D center in India, and local offices and operators. I worked across analysis, architecture, development, and deployment using Java EE, EJB, JMS, RichFaces, AspectJ, Spring, MySQL, and ESB technologies. It was an unusually broad start to my career and taught me early that successful integration work depends on understanding organizations and operational constraints, not only protocols and code.
:::

# Skills

## Applied AI Engineering
<!-- target: all; web: collapsed -->

Category: Engineering practices

:::detail target="web" web="collapsed"
I began using generative-AI development tools at Vertex during the early-access period of GitHub Copilot and later adopted Claude Code. That early exposure gave me time to move beyond code completion and develop a practical understanding of where coding agents help, where they fail, and how strongly their results depend on the context and feedback provided to them.

I now use OpenCode daily as a coding agent and pair-programming partner throughout the SDLC. My usual approach follows an explicit research, plan, and implement loop: the agent first explores the codebase and constraints, then helps evaluate a design before making and verifying changes. I create project-specific instructions, reusable skills, commands, context sources, and validation workflows that reflect each system’s architecture. One harness does not fit every repository, especially when an agent has to work safely with mature or highly constrained software.

I also contributed to a custom AI workflow for analysing failures across Vertex’s large suite of system and functional tests. Many failures originate in external dependencies rather than the product under test, and distinguishing the two previously required substantial manual investigation. The workflow uses retrieval-augmented generation with historical test runs, logs, metrics, and related operational evidence to identify likely dependency failures and separate them from regressions requiring engineering attention. It allows the team to complete much of that initial triage in minutes.
:::

## Systems Design and Integration
<!-- target: all; web: collapsed -->

Category: Software architecture

:::detail target="web" web="collapsed"
I have designed systems and implemented integrations throughout my career, including mobile-operator billing, binary-SMS content delivery, eSIM provisioning, vehicle-to-cloud communication, banking mainframes, tax engines, and data platforms. Those projects involved REST and SOAP APIs, files and FTP, queues and event streams, RSocket, JMS, proprietary protocols, and third-party systems with very different operational guarantees.

I put particular emphasis on what happens between applications rather than treating integration as a connector-selection exercise. The important decisions include the source of truth, synchronous versus asynchronous communication, transaction boundaries, durability, consistency, ordering, idempotency, retries, timeouts, backpressure, observability, and recovery after partial failure. I understand the convenience and immediate feedback of synchronous calls as well as the decoupling and resilience offered by asynchronous workflows, together with the additional state and failure modes each approach introduces.

Much of my work has involved adding reliability to systems without changing the behaviour their customers and dependent applications already expect. I prefer explicit contracts and failure semantics, incremental changes, and designs that can explain not only the successful path but also what happens when a dependency is slow, unavailable, duplicated, or returns after an interrupted operation.
:::

## Testing and Performance Engineering
<!-- target: all; web: collapsed -->

Category: Engineering practices

:::detail target="web" web="collapsed"
Testing has been a substantial part of every stage of my career, but I do not apply one testing scheme to every system. A legacy application under maintenance needs characterization and regression tests that establish its existing behaviour before it can be changed safely. A greenfield service allows test boundaries to be designed with the architecture, while integrations with physical devices or external systems require focused contract, integration, and end-to-end testing.

I introduced safety nets around Commerzbank’s legacy cash-logistics platform, helped build a vehicle-independent test environment at HARMAN, tested AVILOO’s platform with real cars, and developed resilience and chaos tests for IDEMIA’s AWS system. I have worked with JUnit, Spock, Mockito, ScalaTest, JBehave, REST Assured, Selenium, Gatling, and other JVM testing tools, but tool choice is secondary to selecting the test that exposes the relevant risk with the shortest useful feedback loop.

My performance work has included high-volume map and reporting pipelines, constrained HSM throughput, reactive vehicle telemetry, database queries, and worker concurrency in Kubernetes. I approach performance through measurement and system behaviour: identify the constrained resource, reproduce the workload, observe queues and dependencies, and verify that an optimization improves the complete flow rather than moving the bottleneck elsewhere.
:::

## Infrastructure as Code and Delivery
<!-- target: all; web: collapsed -->

Category: Cloud engineering

:::detail target="web" web="collapsed"
I have worked with Terraform, Pulumi, and Ansible while developing and delivering production systems, and I have contributed to deployment configuration through Helm, Argo CD, Flux, Jenkins pipelines, and related tooling. My involvement has ranged from adapting infrastructure for an application’s requirements to diagnosing deployment behaviour and changing the code that connects an application to its runtime environment.

I am strongest at the boundary between software and infrastructure: translating application needs into deployment, configuration, permissions, resources, and managed services, then understanding how those decisions affect production behaviour. I do not present myself as a dedicated infrastructure-as-code or platform-engineering specialist, but I am comfortable entering these codebases, understanding their model, making reviewed changes, and collaborating with the engineers who operate the wider platform.
:::

## Java
<!-- target: all; web: collapsed -->

Category: Programming languages

:::detail target="web" web="collapsed"
Java has been the continuous thread through my career. I first used it professionally in Java EE systems at Comarch and later applied it to geospatial data processing, banking platforms, eSIM provisioning, reactive vehicle diagnostics, and tax-reporting services. Even when Scala or Clojure became my primary language for a project, Java and the JVM remained the foundation I returned to.

My experience is not tied to one framework or generation of the language. It spans application-server-era Java, modern Spring services, concurrent and distributed systems, and the careful modernization of long-lived codebases. I continue to follow the language and platform as they evolve while maintaining the JVM fundamentals needed to understand how an application behaves beyond its source code. Java remains the language in which I have the greatest depth.
:::

## Clojure / ClojureScript
<!-- target: all; web: collapsed -->

Category: Programming languages

:::detail target="web" web="collapsed"
Clojure is now my principal language alongside Java. I learned it after joining Taxamo in 2021 and became productive in an established codebase while contributing across design, implementation, testing, delivery, and production support. Because the Taxamo stack extends beyond backend services, I have also worked with ClojureScript and used Babashka for scripting and development tooling.

Learning Clojure changed more than my syntax. Its emphasis on immutable data, composition, and separating state from behavior gave me a different way to structure programs, while REPL-driven development made exploration and feedback part of the implementation process. Those ideas now influence how I approach code in other languages, including Java.
:::

## Scala
<!-- target: all; web: collapsed -->

Category: Programming languages

:::detail target="web" web="collapsed"
I learned Scala at IDEMIA, where it became the first language beyond Java that I used professionally. Its familiar JVM foundation made the initial transition approachable, but the real value came from learning functional programming through production work rather than isolated exercises.

Scala, together with Akka, gave practical meaning to immutability, function composition, explicit state transitions, and type-driven design. It permanently changed how I think about state and concurrency and continues to influence the Java and Clojure code I write today.
:::

## Snowflake
<!-- target: all; web: collapsed -->

Category: Data platforms

:::detail target="web" web="collapsed"
I began working with Snowflake at Vertex in 2024 while extending a high-volume reporting service originally designed around AWS Athena. Supporting Snowflake was not a simple SQL port: complex queries and application behavior built around Athena’s Presto- and Trino-derived semantics had to be translated, tested, and tuned for Snowflake without changing report results.

My work has since covered application integration, query analysis and optimization, continuous ingestion with Snowpipe, and transformation workflows defined with dbt. This has given me experience across the path from data entering the platform to applications querying it in production.
:::

## Spring
<!-- target: all; web: collapsed -->

Category: Application frameworks

:::detail target="web" web="collapsed"
I have used Spring across much of my career, from early telecommunications and map-processing systems to banking and cloud-native services. My production experience spans Spring Core, Data, JPA, Batch, Web, WebFlux, Integration, AOP, Security, and Spring Boot; I have also explored Spring AI in private projects.

At Commerzbank, I used Spring Integration while modernizing a legacy banking application and connecting its internal workflows. At Luminor, I worked extensively with Spring WebFlux in reactive banking services, standardizing their configuration and Reactor usage before integrating Resilience4j into their asynchronous flows.

I treat Spring as a toolbox rather than allowing it to define an application’s architecture by default. Understanding its dependency injection, configuration, auto-configuration, lifecycle, and integration points lets me use the framework where it removes useful boilerplate while keeping application behavior explicit enough to test, operate, and troubleshoot.
:::

## Temporal
<!-- target: all; web: collapsed -->

Category: Workflow orchestration

:::detail target="web" web="collapsed"
I began using Temporal at Vertex while extracting report-generation functionality from a 25-year-old monolith into a standalone service. Temporal orchestrated the new workflows, but the difficult part was preserving established behavior while choosing durable boundaries for work that had previously run inside one process.

Some activities depended on report files local to a particular worker, so the design had to account explicitly for worker locality instead of assuming every task was location-independent. Kubernetes pod limits also required deliberate management of task queues and worker concurrency rather than relying on defaults. Solving these problems gave me practical experience with workflow and activity boundaries, retries, timeouts, determinism, worker scaling, and the operational behavior of Temporal under real workloads.
:::

## Polylith
<!-- target: all; web: collapsed -->

Category: Software architecture

:::detail target="web" web="collapsed"
At Taxamo, I helped move a large Clojure system from multiple repositories into a Polylith-based monorepo. The migration touched a substantial part of the codebase because many independently deployed services shared libraries and domain behavior that had evolved across repository boundaries.

Polylith is an architectural approach rather than a framework. It gave us one development environment with explicit, composable components that could be assembled into different deployable services. We did not adopt every part of the model, but even the partial adoption made shared code easier to navigate, change, test, and release consistently. Despite the scale of the migration, I would choose the approach again for a system with similar characteristics.
:::

## Akka
<!-- target: all; web: collapsed -->

Category: Distributed systems frameworks

:::detail target="web" web="collapsed"
I first used the actor model through Akka Classic on IDEMIA’s Scala-based eSIM platform. Actors gave us a practical way to coordinate concurrent, stateful provisioning work around limited HSM capacity, while Akka Persistence allowed actor state to be reconstructed after restarts by replaying persisted events.

Akka’s finite-state-machine model and DSL were especially influential. I later adapted a subset of those ideas into [java-fp-fsm](https://github.com/dsinczak/java-fp-fsm), a small pure-Java implementation that separates the pattern from the actor runtime. Akka left a lasting mark on how I design message-driven workflows, state transitions, and recovery in distributed systems.
:::

## Project Reactor
<!-- target: all; web: collapsed -->

Category: Reactive programming

:::detail target="web" web="collapsed"
I worked extensively with Project Reactor at AVILOO, where several services formed a reactive platform for processing electric-vehicle telemetry. Communication between services and devices installed in customers’ cars used RSocket. Together, Reactive Streams and protocol-level backpressure gave us explicit control over asynchronous data flow, but they did not remove the need for careful capacity planning, tuning, debugging, and observability.

At Luminor, I inherited several Reactor-based services handling foreign-exchange rates and transaction processing with inconsistent reactive patterns. I standardized and tuned those flows, then integrated Resilience4j retries and circuit breakers into the reactive chains. The experience taught me both where non-blocking processing is valuable and how quickly it becomes difficult to reason about when concurrency, error handling, and operational behavior are not designed consistently.
:::

## jOOQ
<!-- target: all; web: collapsed -->

Category: Persistence and database tooling

:::detail target="web" web="collapsed"
I first used jOOQ at AVILOO, and it became my preferred approach to relational database access in Java. Its type-safe SQL DSL and generated schema model provide compiler support without hiding the query, joins, or data flow behind an object graph.

That tradeoff suits the way I work: the database remains an explicit part of the system design, SQL can be reviewed and optimized directly, and application code still benefits from strong typing. I use ORM tools where their abstraction fits the domain, but I prefer jOOQ when query behavior and database control matter more than transparent object persistence.
:::

## PostgreSQL
<!-- target: all; web: collapsed -->

Category: Relational databases

:::detail target="web" web="collapsed"
I first worked extensively with PostgreSQL at TomTom, where it stored complex map data processed through PostGIS and JTS. That project required more than conventional persistence: geographic operations, spatial relationships, and large conversion pipelines made the database part of the system’s computational model.

I later used PostgreSQL in AVILOO’s vehicle-diagnostics platform and in banking services at Luminor. At Vertex, it is also the core operational database behind the Taxamo product, giving me sustained experience with a mature production schema and business-critical workloads. Across these systems, I worked with schema design, application queries, migrations through Flyway and Liquibase, and data access through jOOQ, Querydsl, Spring Data, and direct SQL. My experience is application-facing rather than database administration, with an emphasis on understanding generated queries, data models, migrations, and production performance.
:::

## Maven
<!-- target: all; web: collapsed -->

Category: Build system

:::detail target="web" web="collapsed"
I have used Maven throughout my career to build and maintain Java systems across very different generations of the ecosystem. Beyond dependency and plugin configuration, I have written and modified Maven plugins and diagnosed build behavior through its lifecycle, profiles, and inheritance model.

Maven’s convention-heavy structure can be restrictive, but it also makes mature builds predictable once their effective configuration is understood. That predictability remains valuable in large or long-lived Java codebases where the build itself is part of the legacy system that must be changed safely.
:::

## Gradle
<!-- target: all; web: collapsed -->

Category: Build system

:::detail target="web" web="collapsed"
Gradle is usually my first choice for Java projects when the build requires more customization than Maven’s lifecycle comfortably provides. Its programmable task model offers considerable freedom, which is also its main risk: without discipline, build logic can become another application that the team has to maintain.

I value that flexibility, but I do not treat familiarity with one Gradle version as permanent expertise. Its APIs, conventions, and recommended practices continue to evolve, so I approach build changes by understanding the current task graph and configuration model rather than relying on habits learned from an older release.
:::

## AWS
<!-- target: all; web: collapsed -->

Category: Cloud provider

:::detail target="web" web="collapsed"
My first substantial AWS work came at IDEMIA while helping take one of the company’s early AWS-based applications toward production. The platform used EKS, EC2, DynamoDB, S3, ECR, KMS, Elastic Load Balancing, Application Load Balancers, and AWS Shield. I contributed to its deployment model, security, observability, performance testing, and resilience, including an internal chaos-testing framework that used AWS APIs to inject failures in lower environments and verify recovery.

I later worked on banking services deployed to Luminor’s EKS-based AWS platform. At Vertex, my AWS work spans reporting systems built around Athena and S3 as well as production workflows using DynamoDB, DynamoDB Streams, multi-Region replication, SQS and many other services. This required understanding not only the service APIs but also event propagation, consistency, failure handling, and the operational consequences of distributing data across regions.

My experience is strongest at the boundary between application architecture and cloud operation: choosing and integrating managed services, designing software for AWS, deploying and troubleshooting it, and understanding its failure modes. I do not present myself as a specialist in organization-wide AWS networking or account administration.
:::

## Kubernetes
<!-- target: all; web: collapsed -->

Category: Container orchestration

:::detail target="web" web="collapsed"
I first worked with Kubernetes at IDEMIA, where the eSIM platform ran in the company’s private data center. I later used Kubernetes on AWS at IDEMIA and Luminor, and it remains part of my daily work at Vertex. I deploy and troubleshoot applications, work with manifests, ConfigMaps, Secrets, Helm, and operators, and have automated recurring tasks with custom scripts. My GitOps experience includes current work with Argo CD and earlier work with Flux.

My expertise is deliberately application-facing. I understand how workloads are scheduled, configured, observed, and affected by resource limits, networking, and platform failures, but I have not provisioned or administered Kubernetes clusters themselves. That boundary matters: operating software effectively on Kubernetes is substantial experience, but it is not the same job as building and running the platform.
:::

## Docker
<!-- target: all; web: collapsed -->

Category: Containerization

:::detail target="web" web="collapsed"
My Docker work is primarily application-focused. I use it to package JVM and Clojure services, build and inspect images, maintain Dockerfiles, and diagnose startup, configuration, filesystem, networking, and runtime problems before those images are deployed to Kubernetes.

For me, Docker is not merely a final packaging step. Container boundaries affect build reproducibility, local development, security, resource usage, and what can be observed when an application fails. My experience is strongest in designing and troubleshooting those boundaries rather than administering the underlying container runtime infrastructure.
:::

## Docker Compose
<!-- target: all; web: collapsed -->

Category: Container orchestration

:::detail target="web" web="collapsed"
At AVILOO, Docker Compose was our production orchestration approach rather than merely a local development tool. We used it to run the platform’s services and supporting infrastructure as a coherent multi-container system, giving the stack a shared definition for configuration, networking, volumes, and lifecycle management.

Operating Compose in production gave me direct experience of both its simplicity and its limits. It kept a relatively compact platform understandable without introducing a larger orchestration layer, but it also left the team responsible for concerns such as service health, restarts, deployments, resource constraints, and host-level resilience. I have continued to use Compose for repeatable development and integration-test environments, while using Kubernetes for systems that require broader scheduling and operational capabilities.
:::

# Education

## Lodz University of Technology
<!-- target: all -->

Icon: content/politechnika_lodzka_logo.jpeg
Degree: Master of Science, Software Engineering and Artificial Intelligence
Period: 2004 - 2009

## Warsaw University of Technology
<!-- target: all -->

Icon: content/warsaw_university_of_technology_logo.jpeg
Degree: Graduate, IT Project Management
Period: 2010 - 2011

# Publications

## Clojure for brave and true
<!-- target: all; web: collapsed -->

Date: 2024-01-23
Venue: Java User Group Łódź
Link: https://www.facebook.com/groups/juglodz/permalink/7140015136113143/

:::detail target="web" web="collapsed"
After several years of professional Clojure work at Taxamo and Vertex, I introduced the language to the Java User Group in Łódź. Rather than presenting slides about syntax, I built a small full-stack TODO application live, using Clojure on the server and ClojureScript in the browser.

The emphasis was on the REPL and what interactive development actually changes. For an audience accustomed to the edit, compile, restart, and navigate-back cycle of a typical JVM application, watching state survive while functions are redefined in a running system is a more persuasive argument than any list of language features.
:::

## What are DDD sagas how Event Sourcing can help us with them
<!-- target: all; web: collapsed -->

Date: 2018-01-24
Venue: Java User Group Łódź
Link: https://www.meetup.com/java-user-group-lodz/events/246675268/

:::detail target="web" web="collapsed"
At IDEMIA I used Akka persistent actors to model long-running eSIM provisioning workflows. One example was a key-exchange protocol that allowed an eSIM profile to be transferred between two mobile network operators without either party disclosing its keys directly. A workflow of that kind spans several systems, takes an unpredictable amount of time, and has to remain auditable and recoverable after partial failure.

The presentation walked the audience through that problem and the pieces used to solve it: sagas as the Domain-Driven Design answer to coordinating work across aggregate and service boundaries, persistent actors as the runtime, and an event store as the durable record of what had happened. My aim was to show why event sourcing and sagas complement each other, rather than presenting either as an isolated pattern.
:::

## Edit&Pray, how to deal with legacy code
<!-- target: all; web: collapsed -->

Date: 2016-05-18
Venue: Łódź ICT Claster presentation
Link: https://www.facebook.com/events/799959023473215/

:::detail target="web" web="collapsed"
Taking ownership of Commerzbank's cash-logistics platform at CERI forced me to develop a working method for legacy software rather than a set of opinions about it. This talk covered what my team and I had actually field-tested: recovering undocumented business rules, establishing characterization tests before changing behavior, stabilizing an ageing Ant build, and making small defensible changes instead of arguing for a rewrite.

The title refers to Michael Feathers' distinction between edit and pray and cover and modify. I used his work, together with Fowler's refactoring catalogue, as the framing, but the examples came from a production banking system where the cost of being wrong was measured in cash that failed to reach a branch.
:::

## Aspect oriented programming with the use of AspectJ
<!-- target: all; web: collapsed -->

Date: 2015-11-14
Venue: Java User Group Łódź
Link: https://www.youtube.com/watch?v=I3h-kGeAn2s

:::detail target="web" web="collapsed"
Aspect-oriented programming was the subject of my master's thesis and remained a recurring tool throughout my Java work. Most JVM developers meet it only through Spring AOP, which is built on dynamic proxies and is therefore limited to Spring-managed beans and calls that cross the proxy boundary. AspectJ works at the bytecode level through compile-time or load-time weaving and can reach constructors, field access, and code that no container manages.

I presented that comparison to the Java User Group in Łódź: what aspect-oriented programming solves, where AspectJ's additional reach is worth its complexity, and what weaving does to build times, debugging, testability, and the ability of the next engineer to understand why a method behaves differently from the way it reads.
:::

## Banking of 21st century
<!-- target: all; web: collapsed -->

Date: 2015-11-07
Venue: Careercon.pl

:::detail target="web" web="collapsed"
I gave this talk at a careers fair on behalf of CERI, Commerzbank's Polish subsidiary, while we were building the engineering team in Łódź. It was a direct account of what banking software involves: long-lived systems that cannot be switched off, mainframe integration, regulatory and security constraints, performance requirements driven by settlement windows rather than user impatience, and the fact that most of the work modernizes existing systems rather than starting new ones.

The recruitment purpose was explicit, but the argument was not that banking is glamorous. It was that engineers who want problems with real consequences, and who are willing to work inside constraints they did not choose, find more of both here than in most greenfield projects.
:::

# Languages

- Polish (native)
- English (fluent)
