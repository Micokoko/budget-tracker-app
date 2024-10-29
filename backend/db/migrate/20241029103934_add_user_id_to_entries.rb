class AddUserIdToEntries < ActiveRecord::Migration[6.0]
  def change
    unless column_exists?(:entries, :user_id)
      add_reference :entries, :user, null: false, foreign_key: true
    end
  end
end
