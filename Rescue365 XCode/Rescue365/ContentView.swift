import SwiftUI

// New Rescue User page
struct RescueUserView: View {
    var body: some View {
        VStack {
            Text("Create a New Rescue User")
                .font(.title)
                .padding()
            Spacer()
            // You can add form fields here for creating a new rescue user
        }
        .navigationTitle("Rescue User")
    }
}

// New Bystander User page
struct BystanderUserView: View {
    var body: some View {
        VStack {
            Text("Create a New Bystander User")
                .font(.title)
                .padding()
            Spacer()
            // You can add form fields here for creating a new bystander user
        }
        .navigationTitle("Bystander User")
    }
}

struct ContentView: View {
    
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var errorMessage: String = ""
    @State private var isLoggedIn: Bool = false

    var body: some View {
        NavigationStack {
            VStack {
                // Title
                Text("Login")
                    .font(.largeTitle)
                    .bold()
                    .padding(.top, 50)
                
                // Email TextField
                TextField("Email", text: $email)
                    .padding()
                    .background(Color.white)
                    .cornerRadius(5)
                    .shadow(radius: 5)
                    .foregroundColor(.black) // Set the text color to black
                    .padding(.horizontal, 20)
                    .padding(.top, 50)
                
                // Password SecureField
                SecureField("Password", text: $password)
                    .padding()
                    .background(Color.white)
                    .cornerRadius(5)
                    .shadow(radius: 5)
                    .foregroundColor(.black) // Set the text color to black
                    .padding(.horizontal, 20)
                    .padding(.top, 20)
                
                // Error Message
                if !errorMessage.isEmpty {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .padding(.top, 10)
                }
                
                // Login Button
                Button(action: {
                    login()
                }) {
                    Text("Login")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity, minHeight: 44)
                        .background(Color.blue)
                        .cornerRadius(8)
                        .padding(.top, 20)
                        .padding(.horizontal, 20)
                }
                
                Spacer()
                
                // Create new user buttons
                VStack {
                    NavigationLink(destination: RescueUserView()) {
                        Text("Create a new Rescue User")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity, minHeight: 44)
                            .background(Color.blue)
                            .cornerRadius(8)
                            .padding(.top, 20)
                            .padding(.horizontal, 20)
                    }

                    NavigationLink(destination: BystanderUserView()) {
                        Text("Create a new Bystander User")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity, minHeight: 44)
                            .background(Color.blue)
                            .cornerRadius(8)
                            .padding(.top, 20)
                            .padding(.horizontal, 20)
                    }
                }
                .padding(.bottom, 30) // Add some padding at the bottom
            }
            .background(Color.gray.opacity(0.1).edgesIgnoringSafeArea(.all)) // Background Color
            .navigationTitle("Login")
            
            // Navigation to Home after successful login
            .background(
                NavigationLink(
                    destination: HomeView(),
                    isActive: $isLoggedIn
                ) {
                    EmptyView()
                }
            )
        }
    }
    
    // Simulate a login process
    func login() {
        // Clear any previous error message
        errorMessage = ""
        
        // Simple validation logic (replace this with actual backend validation)
        if email.isEmpty || password.isEmpty {
            errorMessage = "Please enter both email and password."
        } else if email == "user@example.com" && password == "password" {
            // Login successful
            isLoggedIn = true
            errorMessage = ""
            print("Login successful!")
        } else {
            // Login failed
            errorMessage = "Invalid email or password."
        }
    }
}

// Home screen view to display after successful login
struct HomeView: View {
    var body: some View {
        VStack {
            Text("Welcome to the Home Screen!")
                .font(.title)
                .padding()
            Spacer()
        }
        .navigationTitle("Home")
    }
}

#Preview {
    ContentView()
}
