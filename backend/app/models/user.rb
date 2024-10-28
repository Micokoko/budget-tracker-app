class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
    has_secure_password
    has_many :entries, dependent: :destroy

    validates :name, presense: true
    validates :username, presense: true, uniqueness: true
    validates :email, presense: true, uniqueness: true
    validates :cash, numericality: {greater_than_or_equal_to: 0}
    validates :liabilities, numericality: {greater_than_or_equal_to: 0}
end
