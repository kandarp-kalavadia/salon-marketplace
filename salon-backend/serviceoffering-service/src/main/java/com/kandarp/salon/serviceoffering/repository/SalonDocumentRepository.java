package com.kandarp.salon.serviceoffering.repository;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.kandarp.salon.serviceoffering.entity.SalonDocument;

public interface SalonDocumentRepository extends ElasticsearchRepository<SalonDocument, Long> {
}