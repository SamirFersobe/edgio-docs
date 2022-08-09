---
title: Rate Rules
---

A rate rule restricts the flow of site traffic with the intention of:

-   Diverting malicious or inadvertent DDoS traffic.
-   Preventing a customer origin server from being overloaded.

Requests that exceed the rate limit may be dropped, redirected to
another URL, or sent a custom response. The type of enforcement action
that will take place is determined by the Security Application
configuration that leverages it.

## How Does It Work? {/*how-does-it-work*/}

A rate rule restricts the rate of traffic that may be directed to one or
more web sites. HTTP/HTTPS requests that exceed a rate rule will not be
honored.

Key information:

-   Our service inspects all traffic, regardless of delivery platform,
    when determining whether a rate rule is applicable.

-   A rate rule may be applied to all requests, unique clients, or
    unique user agents.

    ![](/images/app_security/rate_rules_source_scope.png)

-   A [Security Application](SAM.htm) configuration determines
    the set of requests to which this rate rule will be applied. Use
    condition groups to define one or more additional prerequisites
    (e.g., URL or user agent) that a request must meet before it will
    count towards the rate limit.

    If one or more condition group(s) have been defined, then the
    request must also satisfy all of the conditions defined within at
    least one condition group.

-   A rate rule does not take into account whether content needs to be
    requested from an origin server or if a cached version may be served
    directly from our network.

-   A rate rule always runs in [production
    mode](SAM.htm#enforcementmode).

-   A rate rule is enforced by each edge server according to the
    approximate number of requests that it receives over the specified
    time interval (e.g., 1 second, 10 seconds, or 1 minute).

    Requests from a single client may be load balanced to different edge
    servers based on the requested URL.

-   {{ PRODUCT_SECURITY }} does not perform further [evaluation of a
    request](Configuration.htm#Threat) once enforcement is triggered.

    We recommend that you limit your use of the `Alert Only`
    enforcement to the shortest amount of time necessary to validate
    changes to your configuration.

View sample scenarios.

### Scenario 1: Rate Limiting All Requests {/*scenario-1-rate-limiting-all-requests*/}

This scenario assumes that a different edge server is handling each
unique request URL. However, a single edge server could potentially
handle multiple unique request URLs that are eligible for rate rules. In
which case, the rate limit would be applied to the aggregate traffic for
that content.

This scenario assumes:

-   All traffic is directed to a single delivery platform (e.g., HTTP
    Large).

-   A different edge server is handling each unique request URL.

    A single edge server could potentially handle multiple unique
    request URLs that are eligible for rate rules. In which case, the
    rate limit would be applied to the aggregate traffic for that
    content.

Requests will be rate limited according to this configuration:

| Type                 | Setting             | Value                |
| ----------- | ----------- | ----------- |
| Security Application | Hostname | Default configuration (Match all hostnames.)|
| Security Application | URL path(s) | Default configuration (Match all URL paths.)|
| Rate Rule            | Apply rate limit to | Any request  <br /><br />This type of source applies a rate limit to all requests without taking into account the client that submitted each request.|
| Rate Rule            | Rate limit          | 300 requests per minute               |

![](/images/app_security/rate_rules_example_all_requests.png)

In the above scenario, the CDN received 1200 requests per minute for the
following three files:

-   **Index.html:** 600 requests
-   **Styles.css:** 400 requests
-   **Logo.png:** 200 requests

The CDN handled the above requests in the following manner:

-   It honored the following 800 requests:

    -   **Index.html:** 300 requests
    -   **Styles.css:** 300 requests
    -   **Logo.png:** 200 requests

    More Information

    A rate limit of 300 requests per minute is being enforced on a per
    edge server basis. Since a different edge server handled each unique
    URL, the maximum number of requests that could have been honored for
    each of these assets is 300. Only 200 requests were honored for
    Logo.png, since it was only requested 200 times within that minute.

-   Our CDN service applied a predefined rate limiting action (e.g., URL
    redirection) to the following 400 requests:

    -   **Index.html:** 300 requests600 requests per minute - 300
        honored requests = 300 rate limited requests
    -   **Styles.css:** 100 requests 400 requests per minute - 300
        honored requests = 100 rate limited requests
    -   **Logo.png:** 0 requestsAll requests for Logo.png were
        honored, since it did not exceed the rate rule.

### Scenario 2: Rate Limiting Unique Clients {/*scenario-2-rate-limiting-unique-clients*/}

This scenario assumes that a different edge server is handling each
unique request URL. However, a single edge server could potentially
handle multiple unique request URLs that are eligible for rate rules. In
which case, the rate limit would be applied to the aggregate traffic for
that content.

This scenario assumes:

-   All traffic is directed to a single delivery platform (e.g., HTTP
    Large).

-   A different edge server is handling each unique request URL.

    A single edge server could potentially handle multiple unique
    request URLs that are eligible for rate rules. In which case, the
    rate limit would be applied to the aggregate traffic for that
    content.

Requests will be rate limited according to this configuration:

| Type                 | Setting             | Value                |
| Security Application | Hostname            | Default configuration (Match all hostnames.) |
| Security Application | URL path(s)         | Default configuration (Match all URL paths.) |
| Rate Rule            | Apply rate limit to | IP address  <br /><br />This type of source applies a rate limit to all requests from unique IP addresses. |
| Rate Rule            | Rate limit          | 50 requests per minute               |

The following diagram illustrates how this rate rule controls the total
number of requests that may flow through our network.

![](/images/app_security/rate_rules_example_unique_clients.png)

In this scenario, only a single client (i.e., laptop) exceeded the rate
limit. Specifically, our CDN service enforced rate limiting for that
client's requests for Index.html and Styles.css. Our CDN service
honored all other requests, since they do not exceed the defined rate
limit (i.e., 50 requests per minute).

Aggregate traffic is not taken into account when rate limiting unique
clients. For example, this rate rule would not be enforced on 2,000
clients if they only issued 5 requests per minute. Although aggregate
traffic exceeded the rate rule, no single client exceeded 50 requests
per minute.

### Scenario 3: Multiple Rate Rules {/*scenario-3-multiple-rate-rules*/}

This scenario assumes that a single edge server is handling all of these
requests.

This scenario assumes:

-   All traffic is directed to a single delivery platform (e.g., HTTP
    Large).
-   A single edge server is handling all traffic.

A Security Application configuration may contain multiple rate
rules that define a custom rate limit for different types of requests.
These rate rules are processed in the order in which they are listed.
Once a rule is satisfied, it will be applied to the request and no
additional rules will be processed.

It is recommended to order rate rules according to how they identify
requests. Stricter rules that identify requests using multiple
conditions should be placed closer to the top of the list, while
catch-all rules should be placed closer to the bottom. This ensures that
your rate limits are applied to requests as intended.

In this scenario, your Security Application configuration
determines that the following rate rules will be applied to all
requests.

PLACEHOLDER

## Configuration {/*configuration*/}

Setting up a rate rule involves determining how requests are grouped and
a rate limit. You may also specify additional criteria to identify the
set of requests to which this rate rule will be applied.

| Category                         | Description                      |
| ----------- | ----------- |
| [Source](#Source)                | Apply a rate limit:  <ul><li>Indiscriminately across all requests. </li><li>To each unique client that exceeds the defined rate limit. <br /><br /> A unique client may be identified by its user agent and/or IP address.</li></ul>           |
| [Rate Limit](#RateLimit)         | Define a maximum request rate before a predefined action is triggered.                       |
| [Condition Group](#ConditionGroup)                      | A request counts towards a rate limit when it satisfies all of the following criteria: <ul><li>A [Security Application configuration's](SAM.htm) hostname and URL path match conditions. </li><li>If one or more condition group(s) have been defined, then the request must also satisfy all of the conditions defined within at least one condition group.  Each condition identifies the type of requests that are eligible for rate limiting by URL path, request headers, IP address, file extension, and/or request method.</li></ul>              |
| Action                           | A [Security Application configuration](SAM.htm) determines the type of action that will be applied to requests that exceed the above rate limit.                           |

### Source {/*source*/}

Rate limiting may be applied across all requests or to each unique
client. Define this behavior from within the **Apply rate limit
to** option. The available modes are described below.

| Mode                      | Description                             |
| ----------- | ----------- |
| Any request               | Indicates that all requests will count towards the rate limit. Once the specified rate limit is exceeded, it will be enforced without taking into consideration which client submitted the request.  This mode is not recommended when there are malicious clients that are spoofing legitimate traffic. This type of configuration may potentially lead to a situation where spoofed traffic is honored while legitimate traffic is rate limited.                           |
| IP address                | Indicates that the requests from each unique client, as determined by its IP address, will be tracked. The specified rate limit will only be enforced on the clients that exceed it.                 |
| IP address and user agent | Indicates that the requests from each unique client, as determined by each unique combination of IP address and user agent (e.g., web browser), will be tracked. The specified rate limit will only be enforced on the clients that exceed it.  All requests from a specific IP address that contain a blank or missing `User-Agent` header will be treated as a single client.             |

### Rate Limit {/*rate-limit*/}

The maximum rate at which requests will be honored before a predefined
action is applied to it is known as the rate limit. A rate limit defines
the number of requests over a given time period (e.g., 5 seconds, 10
seconds, or 1 minute). Define the desired rate limit via the **Rate
limit** option.

Key information:

-   The source that will be rate limited should be taken into account
    when defining a rate limit.

    A rate limit that applies across all requests should be
    significantly larger than a rate limit that applies to unique
    clients.

-   The specified rate limit is enforced on each edge server based on
    the number of requests that it receives.

    -   Typically, a single edge server will handle all requests
        directed to a POP for a specific URL.

        If the volume of requests to the above edge server exceeds
        capacity, then requests will be load balanced to an additional
        edge server.

        Example

        All requests within the Los Angeles area for the following image
        will be handled by a single edge server in a Los Angeles POP
        (e.g., OXR):

```
https://cdn.example.com/marketing/logo.png
```

    -   If rate limiting is being applied to unique clients, then it is
        important to note that requests from a single client may be load
        balanced to different edge servers based on the requested URL.

        Example

        A request for a web page may result in 50 subsequent requests
        for its supporting files (e.g., CSS, JS, and images). Although a
        single client is requesting all 50 of these assets, these
        requests may be load balanced across anywhere from 1 to 50
        different edge servers in a single POP.

### Condition Group {/*condition-group*/}

A condition group defines one or more prerequisites that must be met
before a request will count towards the rate limit.

A request will only count towards the rate limit when it satisfies the
host and URL path match conditions defined within a Security Application
Manager configuration. Additionally, if one or more condition group(s)
have been defined, then the request must also satisfy all of the
conditions defined within at least one condition group.

The types of prerequisites that may be defined are described below.

| Type                             | Description                      |
| ----------- | ----------- |
| <a id="ASN"></a>ASN                      | A request will count towards the rate limit when it originates from an autonomous system (AS) whose number (ASN) matches a value defined in the **Value(s)** option.  <br /><br /> **Example:**   `15133`                              |
| <a id="Country"></a>Country              | A request will count towards the rate limit when it originates from a country whose [code] (../Reference/Country_Codes.htm) matches a value defined in the **Value(s)** option.  |
| <a id="FileExtension"></a>File extension | A request will count towards the rate limit when the filename of the requested content contains a file extension that matches a value defined in the **Value(s)** option.  <br /><br /> **Syntax:**   `.*FileExtension*`  <br /><br /> **Example:**   `.htm`                              |
| <a id="IPAddress"></a>IP address         | A request will count towards the rate limit when its IP address matches a value defined in the **Value(s)** option.  Make sure to use standard IPv4 and CIDR notation.  Specify a subnet by appending a slash (/) and the desired bit-length of the prefix (e.g., 11.22.33.0/22).                  |
| <a id="requestheaders"></a><a id="RequestHeader"></a>Request header                    | A request will count towards the rate limit when the value corresponding to the specified request header is an exact case-sensitive match for the one defined in the **Value(s)** option.  This condition supports the following request headers:  -   `Host` -   `User-Agent` -   `Referer` <a id="Host"></a>Host {#host}  A request will count towards the rate limit when its `Host` header matches the specified hostname or IP address.  <br /><br /> **Syntax:**   -   *Host* -   *Host*:*Port*  Key information:  -   The entire `Host` header value will be compared against the specified value. -   The CDN only accepts HTTP/HTTPS requests on standard ports (i.e., 80 and 443). Typically, a `Host` request header does not include port information for standard ports. However, the requesting user agent defines the `Host` request header submitted to the CDN. -   For the purpose of this comparison, the hostname defined by this match condition will not be resolved to an IP address. -   For the purpose of this comparison, a customer origin's **HTTP Host Header** option is irrelevant.  User-Agent {#user-agent}  A request will count towards the rate limit when its `User-Agent` header matches the specified user agent.  The request's user agent must be an exact match to the specified value. User agent strings typically vary by type and version.  Specify a blank value to match with requests that have a blank or missing `User-Agent` header.  Referer {#referer}  A request will count towards the rate limit when its `Referer` header matches the specified referrer.  The request's referrer must be an exact match to the specified value.                           |
| <a id="RequestMethod"></a>Request method | A request will count towards the rate limit when the request's HTTP method matches a value defined in the **Value(s)** option. Valid values are:  `GET \| POST \| PUT \| HEAD \ | DELETE \| OPTIONS`                              |
| <a id="RequestURLPath"></a>Request URL path  | A request will count towards the rate limit when its request URL contains a relative path that matches a value defined in the **Value(s)** option.  For the purposes of this option, specify a URL path pattern that starts directly after the hostname. Do not include a protocol or a hostname.\ **Sample values:**\ /marketing\ /800001/mycustomerorigin  This type of match condition requires a [Host condition](#Host) within the same condition group.  <br /><br /> **Syntax:**   `/*path*/*asset*`  <br /><br /> **Example:**   `/marketing/brochures/widget.htm`  A partial match does not count towards the rate limit. For example, given the above sample configuration, the following request would not count towards the rate limit: http://cdn.example.com/ marketing/brochures/widget.html. |

Key information:

-   A single condition group may contain multiple conditions.

-   You may define multiple condition groups.

-   All conditions are case-sensitive.

-   <a id="matchconditions"></a>A request will count towards the rate limit when
    it satisfies both of the following conditions:

    -   A Security Application configuration's hostname and URL
        path conditions.
    -   **Condition Groups:** If one or more condition group(s)
        have been defined, then the request must also satisfy all of the
        conditions defined within at least one condition group.

-   Each condition must contain a value through which requests will be
    identified.

    -   Regular expressions or wildcards may not be used to identify
        requests.
    -   Blank values are not allowed.
    -   Specify each desired value on its own separate line.

-   Ensure that your rate limiting configuration complies the following
    limits:

        | Type                             | Limit                            |    
        | Condition groups per rate rule   | 5                                |
        | Conditions per condition group   | 5                                |
        | \# of values per condition <br /><br />This limit only applies when the **Type** option for a condition is set to \"Multiple Match.\" | **IP Address:** 200 <br /><br />**All Other Conditions:** 100 |

## Multiple Rate Rules {/*multiple-rate-rules*/}

You may define multiple rate rules within a [Security Application
Manager configuration](SAM.htm). This type of setup provides greater
control when determining how requests will be rate limited.

Common use cases for multiple rules:

-   Define site-specific rules.
-   Define rules based on traffic profiles.
-   Define rules that track abnormal traffic patterns.

### Rule Order {/*rule-order*/}

The order in which rules are listed is critical, since it determines
which rule will be applied to a request.

It is recommended to order rules according to how they identify
requests. Stricter rules that identify requests using multiple
conditions should be placed closer to the top of the list, while
catch-all rules should be placed closer to the bottom. This ensures that
rules are applied to requests as intended.

Key information:

-   Rules are processed in the order in which they are listed (i.e., top
    to bottom) within a Security Application configuration.

-   Only the first rate rule that a [request
    satisfies](#matchconditions) will be applied to it.

    Once a request satisfies a rate rule, all subsequent rate rules will
    be skipped.

-   Reorder rules by dragging the rate rule's
    ![](/images/icons/drag.png) icon.

## Rate Rule Administration {/*rate-rule-administration*/}

You may create, modify, and delete rate rules.

Key information:

-   Administer rate rules from the [[Rate Rules
    page](https://%5B%=Domains.Portal%%5D/Defend/RulesManager#/defend/waf/rules/rate){target="_blank"
    madcap:conditions="General.EdgeCast,General.TransactOnly"
    madcap:excludeaction="unbind"}]{.portal}.

-   Apply a rate rule to production traffic by adding it to a [Security
    Application Manager configuration](SAM.htm) and then determining how
    it will be enforced. Multiple Security Application
    configurations may use the same rate rule. Leverage this capability
    to tailor security screening by application or traffic profile.

    Before adding a rate rule to a Security Application
    configuration, verify that the Security Application
    configuration's hostname and URL path conditions do not conflict
    with your rate rule's conditions.

-   This service inspects all traffic, regardless of platform, to
    determine whether it should be rate limited.

-   Requests to each delivery platform are counted separately.

    View a sample scenario.

    This scenario assumes the following rate rule:

    -   Identify unique clients by IP address.
    -   A rate limit of 8 requests per second.
    -   A Security Application configuration that matches all
        hostnames and URL paths.
    -   No condition groups.

    It also assumes the following traffic levels for a single client:

    -   **ADN:** 5 requests per second
    -   **HTTP Large:** 10 requests per second

    The above client will be rate limited as follows:

    -   The client's ADN traffic will not be rate limited.
    -   The client's HTTP Large traffic will be rate limited to 8
        requests per second.

-   It may take up to 2 minutes for an updated rate rule to be applied
    across our entire network.

To create a rate rule

1.  

2.  Click **Add Rate Rule**.

3.  In the **Rule name** option, type the unique name by which
    this rate rule will be identified. This name should be sufficiently
    descriptive to identify it when setting up a Security Application
    Manager configuration.

4.  In the **Apply rate limit to** option, indicate whether the
    rate limit should be applied across all requests or to each unique
    client.

5.  In the **Rate limit** option, define the maximum rate at
    which requests may flow to your origin server(s). Define this rate
    by indicating the maximum number of requests for the selected time
    interval (e.g., 1 second, 30 seconds, 1 minute, etc.).

6.  <a id="ConditionGroup"></a>Optional. Create a condition group to identify
    the types of requests that qualify for rate limiting.

    i.  Click the **+ New condition group** label.

    ii. Optional. Click on its label (e.g., Condition group 1) and then
        type a brief name that describes the purpose of the condition
        group.

    iii. Select the condition (e.g., Condition 1) to view its
         properties.

    iv. In the **Match by** option, select the method by which
        requests will be identified.

        If you set this option to [Request header]{.listitem}, then you
        should also select the desired request header from the **Request
        header name** option.

    v.  Skip this step if you are matching by IP address. Otherwise, in
        the **Match type** option, determine whether the
        **Value(s)** option will contain one or more exact
        value(s) or a regular expression.

    vi. Perform either of the following steps:

        -   **Multiple Exact Match:** In the **Value(s)**
            option, type the value that must be satisfied before a
            request will count towards the rate rule. Repeat this step
            as needed. Place each desired value on a separate line.

            Use the **Case sensitive** option to determine
            whether a case-sensitive comparison will be performed.

        -   **Regex:** In the **Value(s)** option, type the
            desired regular expression pattern.

    vii. Choose whether this condition will be satisfied when a request
         matches or does not match a value defined in the
         **Value(s)** option.

         -   **Matches:** Clear the **Negative match**
             option.
         -   **Does Not Match:** Mark the **Negative match**
             option.

    viii. Optional. Add another condition to the current condition group
          by clicking **+ New condition** and then repeating steps
          iv - vii.

          If a condition group has been defined, then a request must
          satisfy all of the conditions within at least one condition
          group in order to be eligible for rate limiting.

    ix. Optional. Create another condition group by following steps i -
        viii.

        Multiple condition groups provide the means for identifying
        different types of requests for the purpose of rate limiting.

7.  Click **Save**.

To modify a rate rule

1.  
2.  Click on the desired rate rule.
3.  Make the desired changes.
4.  Click **Save**.

To delete a rate rule

You cannot delete a rate rule that is associated with a Security
Application Manager configuration. Please either modify the Security
Application Manager configuration to point to a different rate rule or
delete that Security Application configuration.

1.  Check your Security Application configurations to verify
    that the desired rate rule is not in use.
2.  
3.  Click **Delete rate rule**.
4.  Type *DELETE*.
5.  Click **Delete**.