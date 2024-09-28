package entity

import (
	"time"
	"gorm.io/gorm"
)

type LeaveRequest struct {
	gorm.Model
	Status string `json:"status"`
	Day time.Time `json:"day"`
	Description string    `json:"description"`

	UserID   uint  `json:"user_id"`
    User     *Users  `gorm:"foreignKey: user_id" json:"user"`
}