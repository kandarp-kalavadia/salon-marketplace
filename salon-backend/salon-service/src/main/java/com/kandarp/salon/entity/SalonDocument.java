package com.kandarp.salon.entity;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;

@Data
@Document(indexName = "salons")
public class SalonDocument {

    @Id
    private Long salonId;

    @Field(type = FieldType.Text)
    private String salonName;

    @Field(type = FieldType.Text)
    private String address;

    @Field(type = FieldType.Text)
    private String landmark;

    @Field(type = FieldType.Text)
    private String city;

    @Field(type = FieldType.Text)
    private String state;

    @Field(type = FieldType.Keyword)
    private String zipcode;

    @Field(type = FieldType.Text)
    private List<String> serviceNames;

    
}