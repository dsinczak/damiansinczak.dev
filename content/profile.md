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

## Java
<!-- target: all; web: collapsed -->

Category: Programming languages

:::detail target="web" web="collapsed"
Java has been a language that has accompanied me since the beginning of my career, and although I've abandoned it many times for other languages, I keep coming back to it and it's where I'm most skilled. I constantly strive to stay up-to-date on new developments, but I also maintain a solid foundational knowledge of the JVM and the language. If I had to call myself an expert in any language, it would be Java.
:::

## Clojure / ClojureScript
<!-- target: all; web: collapsed -->

Category: Programming languages

:::detail target="web" web="collapsed"
This is currently my second programming language, which I learned in Taxamo (Vertex). Learning Clojure opens up new areas of my brain when it comes to programming. It shows me that you can program differently and also think differently about code structure and flow. Interactive programming with a REPL also takes this language to a whole new level, which is worth appreciating. Because Taxamo has a stack entirely embedded in Clojure, I also have the opportunity to work with ClojureScript and Babaska.
:::

## Scala
<!-- target: all; web: collapsed -->

Category: Programming languages

:::detail target="web" web="collapsed"
I worked with Scala some time ago at Idemia. It was the first language besides Java that I learned, and right around that time. Anyone who has worked with Scala knows how rewarding the learning process is, when you start with Scala, which is similar to Java, and slowly learn the intricacies of functional programming. Scala forever changed my perception of programming and left a mark on how I program in Java.
:::

## Snowflake
<!-- target: all; web: collapsed -->

Category: Data platforms

:::detail target="web" web="collapsed"
I started working with Snowflake at Vertex in 2024. I had the opportunity to go through many aspects of it, from client applications (and query optimization for their SQL engine - especially translation from complex queries from Presto (AWS Athena) to Snowflake SQL) to pipeline definitions in Snowpipe and transformation definitions using DBT.
:::

## Spring
<!-- target: all; web: collapsed -->

Category: Application frameworks

:::detail target="web" web="collapsed"
I've used Spring at many companies and have quite a bit of experience with it, though it's not my first-choice framework. I always try to use it only where necessary and understandable. I've had contact with many Spring modules: core, data, JPA, batch, web, AOP, security, AI (only in private), and probably many others that were required or used in the project at some point. I'm very familiar with how Spring Boot works and how to use it in a way that's helpful rather than challenging.
:::

## Temporal
<!-- target: all; web: collapsed -->

Category: Application frameworks

:::detail target="web" web="collapsed"
I started working with Temporal at Vertex while working on the Vertex solution reporting system. This was quite an achievement, as I managed to port the code from a 25-year-old monolith to a microservice managed by Temporal. Beyond the functional requirements, we had to grapple with numerous technical challenges, such as part of the process being tied to a worker (due to the locality of the generated report file) and performance issues, where we had to manually manage the Temporal worker queue due to the limitations of the PODs in the Kubernetes cluster. Through this and many others, I had the opportunity to delve deeply into the inner workings of Temporal.
:::

## Polylith
<!-- target: all; web: collapsed -->

Category: Application frameworks

:::detail target="web" web="collapsed"
Moving our Taxamo project from a multi-repo to a monorepo using Polylith was one of the biggest challenges of my career at this company, in terms of the volume of changes I had to make to the project. I would certainly do it again. Although we don't utilize all the benefits of Polylith, using this framework significantly simplified work in a codebase that contained a huge amount of shared code across multiple distributed microservices. Polylith not only allows for structure but also streamlines code development and deployment.
:::

## Akka
<!-- target: all; web: collapsed -->

Category: Application frameworks

:::detail target="web" web="collapsed"
I first encountered actor systems in Akka (in its classic version) in the Scala project Idemia, and it was one of the best frameworks I've encountered for distributed systems. The approach of dividing work into actors was revolutionary in my opinion. Additionally, persistent actors allowed us to build a failsafe system that could resume workflows at any point. One of the elements I repeated many times (I ported this code to Java – it's available on my GitHub) was a finite state machine and DSL modeled after the Akka FSM.
:::

## Reactor.io
<!-- target: all; web: collapsed -->

Category: Reactive programming

:::detail target="web" web="collapsed"
I had the opportunity to work with Reactor at Aviloo, where the entire application (several microservices) was based on this framework. Communication between services and devices we installed in the client's car was based on RSocket, which, together with Reactor.io, allows for incredible flexibility through the use of backpressure and reactive streams. I have great sympathy and respect for this technology; it's not simple and requires proper tuning and monitoring, but it certainly allows the system to scale beyond the limits of thread-pooled applications.
My second encounter with reactor took place at luminor bank, where several microservices related to fx-rates and transaction processing used this technology in a rather chaotic way. I focused on unifying and tuning these applications so that the use of the library was optimal. In the next stage, I added some resilience solutions (retry, circuit breaker) using resilience4j, which is not so obvious in the case of reactive applications.
:::

## Jooq
<!-- target: all; web: collapsed -->

Category: Persistence and database tooling

:::detail target="web" web="collapsed"
I encountered Jooq at Aviloo, and it immediately became my first-choice library for database access. This FRM gives you control over your code and what your application does to a degree you can only dream of with ORMs like Hibernate.
:::

## Maven
<!-- target: all; web: collapsed -->

Category: Build system

:::detail target="web" web="collapsed"
I've encountered Maven many times in numerous projects and am familiar with both its use and configuration. I've also written and modified plugins numerous times, so I'm no stranger to the Maven lifecycle.
:::

## Gradle
<!-- target: all; web: collapsed -->

Category: Build system

:::detail target="web" web="collapsed"
It's usually my first choice for Java projects, though I still feel like I'm learning the tool and rediscovering it with each new version. While I like Maven's conventions, the freedom Gradle provides appeals to me more.
:::

## AWS
<!-- target: all; web: collapsed -->

Category: Cloud provider

:::detail target="web" web="collapsed"

:::

## Kubernetes
<!-- target: all; web: collapsed -->

Category: Container orchestration

:::detail target="web" web="collapsed"
My early contact with K8S dates back to my first stint at Idemia. It was a cluster deployed in Idemia's private DC, and later, I've primarily worked with K8S on AWS (also at Idemia, Luminor, and currently at Vertex, where it's a core solution). I'm an experienced user and understand how Kubernetes and its individual components work. I can work with it daily, deploy applications, and analyze its results. I've had the opportunity to create custom scripts and work with Helm on numerous occasions. I'm currently working with ArgoCD, but I also have experience with Flux in another cluster. I understand how manifests, config maps, secrets, operators, and many other elements a developer needs for everyday work work. However, that's where I'd end it; I've never configured, deployed, or managed K8S.
:::

## Docker
<!-- target: all; web: collapsed -->

Category: Containerization

:::detail target="web" web="collapsed"

:::

## Docker compose
<!-- target: all; web: collapsed -->

Category: Container orchestration

:::detail target="web" web="collapsed"

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

## Aspect oriented programming with the use of AspectJ
<!-- target: all; web: collapsed -->

:::detail target="web" web="collapsed"
Publication listed in the LinkedIn CV. Details can be expanded in a later iteration.
:::

## Edit&Pray, how to deal with legacy code
<!-- target: all; web: collapsed -->

:::detail target="web" web="collapsed"
Publication listed in the LinkedIn CV. Details can be expanded in a later iteration.
:::

## Clojure for brave and true
<!-- target: all; web: collapsed -->

:::detail target="web" web="collapsed"
Publication listed in the LinkedIn CV. Details can be expanded in a later iteration.
:::

## What are DDD sagas how Event Sourcing can help us with them
<!-- target: all; web: collapsed -->

:::detail target="web" web="collapsed"
Publication listed in the LinkedIn CV. Details can be expanded in a later iteration.
:::

## Banking of 21st century
<!-- target: all; web: collapsed -->

:::detail target="web" web="collapsed"
Publication listed in the LinkedIn CV. Details can be expanded in a later iteration.
:::

# Languages

- Polish (native)
- English (fluent)
