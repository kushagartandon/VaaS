package com.vaas.backend.config;

import com.vaas.backend.model.PartnerPlatform;
import com.vaas.backend.model.PlatformEnvironment;
import com.vaas.backend.repository.PartnerPlatformRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PartnerPlatformRepository partnerPlatformRepository;

    public DataInitializer(PartnerPlatformRepository partnerPlatformRepository) {
        this.partnerPlatformRepository = partnerPlatformRepository;
    }

    @Override
    public void run(String... args) {
        if (partnerPlatformRepository.count() == 0) {
            List<PartnerPlatform> defaultPlatforms = List.of(
                PartnerPlatform.builder()
                    .name("Uber")
                    .apiKey("vaas_live_uber_883910")
                    .environment(PlatformEnvironment.LIVE)
                    .active(true)
                    .build(),
                PartnerPlatform.builder()
                    .name("Ola")
                    .apiKey("vaas_live_ola_441029")
                    .environment(PlatformEnvironment.LIVE)
                    .active(true)
                    .build(),
                PartnerPlatform.builder()
                    .name("Urban Company")
                    .apiKey("vaas_live_uc_772190")
                    .environment(PlatformEnvironment.LIVE)
                    .active(true)
                    .build(),
                PartnerPlatform.builder()
                    .name("Zomato")
                    .apiKey("vaas_live_zomato_552104")
                    .environment(PlatformEnvironment.LIVE)
                    .active(true)
                    .build(),
                PartnerPlatform.builder()
                    .name("Swiggy")
                    .apiKey("vaas_live_swiggy_661082")
                    .environment(PlatformEnvironment.LIVE)
                    .active(true)
                    .build()
            );

            partnerPlatformRepository.saveAll(defaultPlatforms);
        }
    }
}

