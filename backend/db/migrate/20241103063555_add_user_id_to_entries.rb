class AddUserIdToEntries < ActiveRecord::Migration[7.2]
  def change
    unless column_exists?(:entries, :user_id)
      add_reference :entries, :user, null: false, foreign_key: true
    end
  end
end
