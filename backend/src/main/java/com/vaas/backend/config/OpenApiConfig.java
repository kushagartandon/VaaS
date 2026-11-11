package com.vaas.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    public static final String API_KEY_SCHEME = "ApiKeyAuth";
    public static final String BEARER_SCHEME = "BearerAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("VaaS (Verification-as-a-Service) B2B API")
                        .version("1.0.0")
                        .description("Centralized Identity, Multi-Platform Gig Worker Onboarding, and Universal Reputation Network.\n\n" +
                                "### Authenticating B2B Requests:\n" +
                                "Endpoints under `/api/platform/*` require a valid Partner Platform API Key.\n" +
                                "- **Header Option 1**: `X-API-Key: vaas_live_uber_883910`\n" +
                                "- **Header Option 2**: `Authorization: Bearer vaas_live_uber_883910`\n\n" +
                                "Test Keys Available:\n" +
                                "- **Uber**: `vaas_live_uber_883910`\n" +
                                "- **Ola**: `vaas_live_ola_441029`\n" +
                                "- **Urban Company**: `vaas_live_uc_772190`\n" +
                                "- **Zomato**: `vaas_live_zomato_552104`\n" +
                                "- **Swiggy**: `vaas_live_swiggy_661082`")
                        .contact(new Contact()
                                .name("VaaS Engineering Team")
                                .url("https://vaas.id"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .components(new Components()
                        .addSecuritySchemes(API_KEY_SCHEME, new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .name("X-API-Key")
                                .description("Enter your platform API key (e.g. vaas_live_uber_883910)"))
                        .addSecuritySchemes(BEARER_SCHEME, new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("API-Key")
                                .description("Enter your platform API key as Bearer token")))
                .addSecurityItem(new SecurityRequirement()
                        .addList(API_KEY_SCHEME)
                        .addList(BEARER_SCHEME));
    }
}

