Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }

  # Additional routes can go here
  get "up" => "rails/health#show", as: :rails_health_check

  # Define the root path route ("/")
  # root "posts#index"
end
