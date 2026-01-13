export const UserRolesEnum = {
    ADMIN : "admin",
    SUPERADMIN : "super-admin",
    STUDENT : "student"
} 

export const AvailableUserRoles = Object.values(UserRolesEnum)

export const MaterialTypesEnum = {
    VIDEO : "video",
    PDF : "pdf", 
    QUIZ : "quiz"
}

export const AvailableMaterialTypes = Object.values(MaterialTypesEnum)

export const enrollmentStatusEnum = {
    PENDING : "pending",
    APPROVED : "approved",
    REJECTED : "rejected"
}

export const AvailableEnrollmentStatus = Object.values(enrollmentStatusEnum)

