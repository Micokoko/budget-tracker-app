class AddFieldsToEntries < ActiveRecord::Migration[7.2]
  def change
    add_column :entries, :date, :date
    add_column :entries, :entry_type, :string
    add_column :entries, :description, :string
    add_column :entries, :amount, :decimal
  end
end
