package com.kandarp.salon.entity;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

@Entity
public class Salon {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long salonId;
	private String salonName;
	private boolean active;
	private String ownerId;
	private LocalTime openTime;
	private LocalTime closeTime;
	private String address;
	private String landmark;
	private String city;
	private String state;
	private String zipcode;
	private String email;
	private String contactNumber;
	
	@ElementCollection
    @CollectionTable(name = "salon_images", joinColumns = @JoinColumn(name = "salon_id"))
    @Column(name = "image_path")
    private List<String> salonImages = new ArrayList<>();

	public Long getSalonId() {
		return salonId;
	}

	public void setSalonId(Long salonId) {
		this.salonId = salonId;
	}

	public String getSalonName() {
		return salonName;
	}

	public void setSalonName(String salonName) {
		this.salonName = salonName;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}

	public LocalTime getOpenTime() {
		return openTime;
	}

	public void setOpenTime(LocalTime openTime) {
		this.openTime = openTime;
	}

	public LocalTime getCloseTime() {
		return closeTime;
	}

	public void setCloseTime(LocalTime closeTime) {
		this.closeTime = closeTime;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getLandmark() {
		return landmark;
	}

	public void setLandmark(String landmark) {
		this.landmark = landmark;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getZipcode() {
		return zipcode;
	}

	public void setZipcode(String zipcode) {
		this.zipcode = zipcode;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public List<String> getSalonImages() {
		return salonImages;
	}

	public void setSalonImages(List<String> salonImages) {
		this.salonImages = salonImages;
	}

	@Override
	public String toString() {
		return "Salon [salonId=" + salonId + ", salonName=" + salonName + ", active=" + active + ", ownerId=" + ownerId
				+ ", openTime=" + openTime + ", closeTime=" + closeTime + ", address=" + address + ", landmark="
				+ landmark + ", city=" + city + ", state=" + state + ", zipcode=" + zipcode + ", email=" + email
				+ ", contactNumber=" + contactNumber + "]";
	}

}
