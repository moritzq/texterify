FactoryBot.define do
    factory :project do
      sequence :name do |n|
        "Project #{n}"
      end
      user
    end
  end
