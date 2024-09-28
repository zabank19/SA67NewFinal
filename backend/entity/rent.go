package entity

import (
    "gorm.io/gorm"
    "time"
)

type Rent struct {
    gorm.Model

    Status         string      
    StartRent time.Time `json:"start_rent"`
    EndRent   time.Time `json:"end_rent"`
    Price float32 `json:"price"`
    UserID   uint  `json:"user_id"`
    User     *Users  `gorm:"foreignKey: user_id" json:"user"`

    CarID uint `json:"car_id"`
    Car   *Cars `gorm:"foreignKey: car_id" json:"car"`

}