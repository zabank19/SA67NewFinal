package rent

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/gtwndtl/projectsa/config"
    "github.com/gtwndtl/projectsa/entity"
)

// GetAll retrieves all rent records
func GetAll(c *gin.Context) {
    var rents []entity.Rent
    db := config.DB()
    results := db.Find(&rents)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, rents)
}

// Get retrieves a single rent record by ID
func Get(c *gin.Context) {
    ID := c.Param("id")
    var rent entity.Rent
    db := config.DB()
    result := db.First(&rent, ID)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    if rent.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }

    c.JSON(http.StatusOK, rent)
}

// Update updates a rent record
func Update(c *gin.Context) {
    rentId := c.Param("id")
    var rent entity.Rent

    db := config.DB()
    result := db.First(&rent, rentId)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Rent not found"})
        return
    }

    if err := c.ShouldBindJSON(&rent); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"status": 400, "message": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&rent)

    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"status": 400, "message": "Failed to update rent record"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": 200, "message": "Updated successfully"})
}

// Delete removes a rent record by ID
func Delete(c *gin.Context) {
    id := c.Param("id")

    db := config.DB()
    if tx := db.Exec("DELETE FROM rents WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"status": 400, "error": "id not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": 200, "message": "Deleted successfully"})
}

// UpdateRentStatus updates the status of a rent record
func UpdateRentStatus(c *gin.Context) {
    rentId := c.Param("id")
    var payload struct {
        Status string `json:"status"`
    }

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
    var rent entity.Rent

    if err := db.First(&rent, rentId).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Rent not found"})
        return
    }

    rent.Status = payload.Status
    if err := db.Save(&rent).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}