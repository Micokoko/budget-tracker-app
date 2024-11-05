class User < ApplicationRecord

  devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable

  validates :username, presence: true, uniqueness: { case_sensitive: false, message: "has already been taken" }
  validates :email, presence: true, uniqueness: { case_sensitive: false, message: "has already been taken" }
  validates :password, presence: true, length: { minimum: 6 }
  validates :cash, numericality: { greater_than_or_equal_to: 0 }
  validates :liabilities, numericality: { greater_than_or_equal_to: 0 }

  after_create :create_user_entries_table

  has_many :entries

end
