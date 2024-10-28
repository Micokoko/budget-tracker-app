class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :name
      t.string :username
      t.string :email
      t.string :password
      t.decimal :cash
      t.decimal :liabilities

      t.timestamps
    end
  end
end
