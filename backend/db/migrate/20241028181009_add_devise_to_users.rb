class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :username
      t.string :email, null: false, default: ""
      t.string :encrypted_password, null: false, default: ""  # Change this field if you had password_digest
      t.decimal :cash, default: 0.0
      t.decimal :liabilities, default: 0.0
      t.timestamps
    end
    add_index :users, :email, unique: true
    add_index :users, :username, unique: true
  end
end
