Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: 'users/registrations', sessions: 'users/sessions' }


  # Additional routes can go here
  get "up" => "rails/health#show", as: :rails_health_check
  get '/entries/:id', to: 'entries#show'


  # Define the root path route ("/")
  # root "posts#index"
  resources :users
  resources :entries

  resources :entries, only: [:create, :index]
  

end
