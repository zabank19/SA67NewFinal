package Leave

import (
	"time"
	"net/http"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"github.com/gtwndtl/projectsa/config"
	"github.com/gtwndtl/projectsa/entity"
 )
 

 type (
	 addLeaveRequest struct {
		 Status    string    `json:"status"`	 
		 Day         time.Time `json:"day"`
		 Description string    `json:"description"`
		 UserID    uint      `json:"user_id"`
	 }
 )

 func AddLeaveRequest(c *gin.Context) {

    var payload addLeaveRequest

    // Bind JSON payload to the struct
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
	var leaveRequestCheck entity.LeaveRequest
	// ตรวจสอบว่ามีคำขอลาที่เกิดขึ้นในวันเดียวกันและเป็นของผู้ใช้คนเดียวกันหรือไม่
	result := db.Where("day = ? AND user_id = ?", payload.Day, payload.UserID).
		First(&leaveRequestCheck)
	
	if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
		// หากมีข้อผิดพลาดในการดึงข้อมูล ยกเว้นว่าข้อมูลไม่พบ
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	
	if leaveRequestCheck.ID != 0 {
		// ถ้ามีคำขอลาของผู้ใช้ในวันดังกล่าวแล้ว
		c.JSON(http.StatusConflict, gin.H{"status": 409, "error": "ทำการลาวันนี้แล้ว"})
		return
	}
	

	 // Create a new leave request
	 leaveRequest := entity.LeaveRequest{
         Status:      payload.Status,
		 Day:         payload.Day,
		 Description: payload.Description,
		 UserID:      payload.UserID,
	 }
 
	 // Save the leave request to the database
	 if err := db.Create(&leaveRequest).Error; err != nil {
		 c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		 return
	 }
	  
	 c.JSON(http.StatusCreated, gin.H{
		"status": 201,
		"message": "Leave request added successfully",
		"leave_id": leaveRequest.ID,
		})
 }
 