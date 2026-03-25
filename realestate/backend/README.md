# Real Estate Backend (Spring Boot)

## Resolve `mvn compile` failing with HTTP 403 from Maven Central

If you see errors like:

- `Could not transfer artifact ... from/to central ... status code: 403`

it means your environment cannot reach public Maven repositories (network policy/proxy restriction), not that Java code is invalid.

### 1) Configure Maven proxy/mirror (recommended)

Create `~/.m2/settings.xml` (or project-local `.mvn/settings.xml`) and point Maven to your organization mirror.

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 https://maven.apache.org/xsd/settings-1.0.0.xsd">

  <mirrors>
    <mirror>
      <id>company-mirror</id>
      <name>Company Maven Mirror</name>
      <url>https://YOUR_ARTIFACTORY_OR_NEXUS_URL/repository/maven-public</url>
      <mirrorOf>*</mirrorOf>
    </mirror>
  </mirrors>

  <proxies>
    <proxy>
      <id>corp-proxy</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>YOUR_PROXY_HOST</host>
      <port>YOUR_PROXY_PORT</port>
      <nonProxyHosts>localhost|127.0.0.1</nonProxyHosts>
    </proxy>
  </proxies>
</settings>
```

### 2) Run build again

```bash
cd realestate/backend
mvn -U -DskipTests compile
```

### 3) Run application

```bash
mvn spring-boot:run
```

## MySQL setup

Ensure you created database `realestate_db` and updated `src/main/resources/application.properties` password:

```properties
spring.datasource.password=YOUR_PASSWORD
```

