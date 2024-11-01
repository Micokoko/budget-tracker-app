class Entry < ApplicationRecord
  belongs_to :user

  validates :date, presence: true
  validates :entry_type, inclusion: { in: %w[Income Expense Liability Settlement] }
  validates :category, presence: true
  validates :description, presence: true
  validates :amount, numericality: { greater_than: 0 }
end
