package entity

import (
	"gorm.io/gorm"
	"time"
)

type Review struct {
	gorm.Model

	Score       float64   `json:"score"`
	Comment     string    `json:"comment"`
	Reply       string    `json:"reply"`
	TimeComment time.Time `json:"timecomment"`
	TimeEdit    time.Time `json:"timeedit"`

	UserID uint    `json:"user_id"`                          // Foreign key to Users
	User   *Users  `gorm:"foreignKey:UserID" json:"user"`    // กำหนด Foreign key

	RentID uint    `json:"rent_id"`                          // Foreign key to Rent
	Rent   *Rent   `gorm:"foreignKey:RentID" json:"rent"`    // กำหนด Foreign key
}
