package com.uca.recycluster.ui.appcontent

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.*
import com.google.android.material.navigation.NavigationView
import com.uca.recycluster.R
import com.uca.recycluster.RecyclusterApplication
import com.uca.recycluster.data.model.User
import com.uca.recycluster.databinding.ActivityMainMenuBinding
import com.uca.recycluster.ui.appcontent.view.fragments.FeedFragment
import com.uca.recycluster.ui.appcontent.view.fragments.NewPostFragment
import com.uca.recycluster.ui.appcontent.view.fragments.ProfileFragment
import com.uca.recycluster.ui.loginSignUp.LoginActivity

lateinit var binding: ActivityMainMenuBinding

@Suppress("DEPRECATION")

class MainContentActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    val app by lazy {
        this.application as RecyclusterApplication
    }

    companion object {
        const val USER_KEY = "USER_KEY"
    }

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var navController: NavController

    // Attributes to receive the user info from the previous activity
    var userId: String = ""
    var userName: String = ""
    var userPhone: String = ""
    var userPoints: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.Theme_Recycluster_ActionBarEnabled)

        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_main_menu)
        // Extracting the user info from the intent
        val userInfo = intent.getSerializableExtra(USER_KEY) as User
        userId = userInfo.id
        userName = userInfo.username
        userPhone = userInfo.phone
        userPoints = userInfo.points ?: 0

        binding.bottomNavigation.setOnNavigationItemReselectedListener { item ->
            when (item.itemId) {
                R.id.page_1 -> {
                    // Respond to navigation item 1 reselection
                    loadFragment(FeedFragment())
                    return@setOnNavigationItemReselectedListener
                }
                R.id.page_2 -> {
                    // Respond to navigation item 2 reselection
                    loadFragment(NewPostFragment())
                    return@setOnNavigationItemReselectedListener
                }
                R.id.page_3 -> {
                    // Respond to navigation item 2 reselection
                    loadFragment(ProfileFragment())
                    return@setOnNavigationItemReselectedListener
                }
            }
        }

        binding.mainActionBar.title = getString(R.string.app_name)
        setupNavigation()
    }

    private fun setupNavigation() {
        setSupportActionBar(binding.mainActionBar)

        val navHostFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController

        appBarConfiguration = AppBarConfiguration(
            setOf(
            //Lista de id donde el jamburge se va a mostrar
                R.id.feedFragment
            ),
            //El drawer que se usa para mostrar el nav
            binding.mainDrawerLayout
        )
        setTitle(R.string.app_name)

        setupActionBarWithNavController(navController, appBarConfiguration)

        setupNavigationView()
    }

    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }
    private fun setupNavigationView() {

        binding.navView.setupWithNavController(navController)
        binding.navView.setNavigationItemSelectedListener(this)
        binding.navView.inflateMenu(R.menu.main_menu)

    }

    private fun startLoginActivity() {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun loadFragment(fragment: Fragment) {
        val transaction = supportFragmentManager.beginTransaction()
        transaction.replace(R.id.nav_host_fragment, fragment)
        transaction.addToBackStack(null)
        transaction.commit()
    }

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        return when(item.itemId) {
            R.id.action_logOut -> {
                app.saveAuthToken("")
                startLoginActivity()
                true
            } else -> {
                val handle = NavigationUI.onNavDestinationSelected(item, navController)
                if(handle) binding.mainDrawerLayout.close()
                handle
            }
        }
    }
}