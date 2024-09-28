package entity

import (
	"time"

	"gorm.io/gorm"
)

type Problem struct {
	gorm.Model
	Title       string    `json:"title"`
	Description string    `json:"description"`
	DT          time.Time `json:"dt"`
	UserID      int64     `json:"user_id"`
	Users       Users     `gorm:" foreignKey:UserID"`
}
