class User < ApplicationRecord

  devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable

  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, length: { minimum: 6 }
  validates :cash, numericality: { greater_than_or_equal_to: 0 }
  validates :liabilities, numericality: { greater_than_or_equal_to: 0 }

  after_create :create_user_entries_table

  has_many :entries

  def create_user_entries_table
    table_name = "user_#{username}_entries"
    unless ActiveRecord::Base.connection.table_exists?(table_name)
      ActiveRecord::Migration.create_table(table_name) do |t|
        t.date :date
        t.string :entry_type
        t.string :description
        t.decimal :amount, precision: 10, scale: 2
        t.timestamps
      end
    end
  end

  def entries_model
    model_class_name = "User#{username.capitalize}Entry"
    Object.const_set(model_class_name, Class.new(ActiveRecord::Base)) unless Object.const_defined?(model_class_name)
    model_class_name.constantize.tap do |model|
      model.table_name = "user_#{username}_entries"
    end
  end
end
