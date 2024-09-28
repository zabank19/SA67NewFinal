package Leave

import (
	"net/http"
    "github.com/gin-gonic/gin"
	"github.com/gtwndtl/projectsa/config"
	"github.com/gtwndtl/projectsa/entity"
	
 )
 
 func GetAllLeaveRequests(c *gin.Context) {
	var leaveRequests []entity.LeaveRequest
	db := config.DB()
	results := db.Find(&leaveRequests)
 
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
 
	c.JSON(http.StatusOK, leaveRequests) // เปลี่ยนเป็น StatusOK
 }
 
 
 func GetLeaveRequest(c *gin.Context) {
	ID := c.Param("id")
	var leaveRequest entity.LeaveRequest
	db := config.DB()
	result := db.First(&leaveRequest, ID)
 
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
 
	if leaveRequest.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
 
	c.JSON(http.StatusOK, leaveRequest)
 }
 

 
 func DeleteLeaveRequest(c *gin.Context) {
	leaveRequestID := c.Param("id")
 
	db := config.DB()
	if err := db.Delete(&entity.LeaveRequest{}, leaveRequestID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": 400, "error": "Leave not found"})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"status": 200, "message": "Delete successful"})
 }

 func UpdateLeaveStatus(c *gin.Context) {
    rentId := c.Param("id")
    var payload struct {
        Status string `json:"status"`
    }

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
    var leaveRequest entity.LeaveRequest

    if err := db.First(&leaveRequest, rentId).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Leave not found"})
        return
    }

    leaveRequest.Status = payload.Status
    if err := db.Save(&leaveRequest).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": 200, "message": "Update successful"})
}
