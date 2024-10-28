class CreateEntries < ActiveRecord::Migration[7.2]
  def change
    create_table :entries do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date
      t.string :entry_type
      t.string :description
      t.decimal :amount

      t.timestamps
    end
  end
end
