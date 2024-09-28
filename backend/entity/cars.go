package entity

import (
    "gorm.io/gorm"
)

type Cars struct {
    gorm.Model
    LicensePlate   string `json:"license_plate"`
    Province       string `json:"province"`
    Brands         string `json:"brands"`
    Models         string `json:"models"`
    ModelYear      string `json:"model_year"`
    Color          string `json:"color"`
    VIN            string `json:"vehicle_identification_number"`
    VRN            string `json:"vehicle_registration_number"`
    Status  string  `json:"status"`
    Type string `json:"type"`
    Price float32 `json:"price"`
    Picture        string `json:"picture" gorm:"type:longtext"`
    
}