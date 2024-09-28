package entity

import (
	"time"
	"gorm.io/gorm"
)

type Users struct {
	gorm.Model
	FirstName string `json:"first_name"`
	LastName string `json:"last_name"`
	Roles uint `json:"roles"`
	Email string `json:"email"`
	Phone      string    `json:"phone"`
	Age uint8 `json:"age"`
	Password string `json:"-"`
	BirthDay time.Time `json:"birthday"`
	Address    string    `json:"address"`

	GenderID uint `json:"gender_id"`
	Gender *Genders `gorm:"foreignKey: gender_id" json:"gender"`

	Picture        string `json:"picture" gorm:"type:longtext"`
}