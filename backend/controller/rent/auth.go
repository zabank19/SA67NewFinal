package rent

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/gtwndtl/projectsa/config"
    "github.com/gtwndtl/projectsa/entity"
)

// addRent represents the structure of the rent data in the request body
type addRent struct {
    Status    string    `json:"status"`
    Price     float32   `json:"price"`
    StartRent time.Time `json:"start_rent"`
    EndRent   time.Time `json:"end_rent"`
    UserID    uint      `json:"user_id"`
    CarID     uint      `json:"car_id"`
}

// AddRent handles the addition of a new rent record
func AddRent(c *gin.Context) {
    var payload addRent

    // Bind JSON payload to the struct
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Validate that StartRent is before EndRent
    if payload.StartRent.After(payload.EndRent) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "StartRent must be before EndRent"})
        return
    }

    db := config.DB()

    // Check if the car is already rented during the requested time period
    var existingRent entity.Rent
    result := db.Where("car_id = ? AND ((start_rent <= ? AND end_rent >= ?) OR (start_rent <= ? AND end_rent >= ?))",
        payload.CarID, payload.EndRent, payload.StartRent, payload.StartRent, payload.EndRent).
        First(&existingRent)

    if result.Error == nil {
        c.JSON(http.StatusConflict, gin.H{"status": 409, "error": "วันที่คุณจองได้มีคนจองรถไว้แล้ว"})
        return
    }

    // Create a new rent record
    rent := entity.Rent{
        Status:    payload.Status,
        Price:     payload.Price,
        StartRent: payload.StartRent,
        EndRent:   payload.EndRent,
        UserID:    payload.UserID,
        CarID:     payload.CarID,
    }

    // Save the rent record to the database
    if err := db.Create(&rent).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Return the rent ID in the response
    c.JSON(http.StatusCreated, gin.H{
        "status":  201,
        "message": "Rent added successfully",
        "rent_id": rent.ID, // ส่ง ID ของ rent กลับไปยัง client
    })
}