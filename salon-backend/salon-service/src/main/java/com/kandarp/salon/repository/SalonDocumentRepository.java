package com.kandarp.salon.repository;
import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.kandarp.salon.entity.SalonDocument;

public interface SalonDocumentRepository extends ElasticsearchRepository<SalonDocument, Long> {
    List<SalonDocument> findBySalonNameOrCityOrServiceNamesContainingIgnoreCase(String salonName,String city, String serviceName);
}