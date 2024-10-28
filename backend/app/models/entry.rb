class Entry < ApplicationRecord
  belongs_to :user

  validates :date, presense: true
  validates :entry_type, inclusion: { in: %w[Income Expense Liability]}
  validates :description, presense: true
  validates :amount, numericality: { greater_than: 0}

  after_save :update_user_cash

  private

  def  update_user_cash
    case entry_type
    when "Income"
      user.cash += amount
    when "Expense"
      user.cash -= amount
    when "Liability"
      user.liabilities += amount
    end
    user.save
  end
end
