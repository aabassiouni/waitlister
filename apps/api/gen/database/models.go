// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.23.0

package database

import (
	"database/sql/driver"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"
)

type Status string

const (
	StatusWaiting Status = "waiting"
	StatusInvited Status = "invited"
)

func (e *Status) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = Status(s)
	case string:
		*e = Status(s)
	default:
		return fmt.Errorf("unsupported scan type for Status: %T", src)
	}
	return nil
}

type NullStatus struct {
	Status Status
	Valid  bool // Valid is true if Status is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullStatus) Scan(value interface{}) error {
	if value == nil {
		ns.Status, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.Status.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullStatus) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.Status), nil
}

type EmailTemplate struct {
	TemplateID   pgtype.UUID
	WaitlistID   pgtype.Text
	UserID       string
	Email        string
	SectionColor string
	BodyText     string
}

type Signup struct {
	SignupID   pgtype.UUID
	WaitlistID string
	Email      string
	FirstName  pgtype.Text
	LastName   pgtype.Text
	CreatedAt  pgtype.Timestamp
	Status     Status
}

type Waitlist struct {
	WaitlistID   string
	UserID       string
	WaitlistName string
	CreatedAt    pgtype.Timestamp
}
