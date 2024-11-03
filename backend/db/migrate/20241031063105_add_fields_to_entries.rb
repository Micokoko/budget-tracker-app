class AddFieldsToEntries < ActiveRecord::Migration[7.2]
  def change
    add_column :entries, :date, :date unless column_exists?(:entries, :date)
    add_column :entries, :entry_type, :string unless column_exists?(:entries, :entry_type)
    add_column :entries, :description, :string unless column_exists?(:entries, :description)
    add_column :entries, :amount, :decimal unless column_exists?(:entries, :amount)
  end
end
