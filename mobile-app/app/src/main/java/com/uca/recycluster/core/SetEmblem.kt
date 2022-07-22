package com.uca.recycluster.core

import android.widget.ImageView
import com.uca.recycluster.R

class SetEmblemByPoints {
    // Set the emblem according to the points of the user
     fun setEmblem (imageView: ImageView, points: Int) {
        when (points) {
            in 0..999 -> imageView.setImageResource(R.drawable.emblem_1)
            in 1000..1999 -> imageView.setImageResource(R.drawable.emblem_2)
            in 2000..2999 -> imageView.setImageResource(R.drawable.emblem_3)
            in 3000..3999 -> imageView.setImageResource(R.drawable.emblem_4)
            else -> imageView.setImageResource(R.drawable.emblem_5)
        }
    }
}