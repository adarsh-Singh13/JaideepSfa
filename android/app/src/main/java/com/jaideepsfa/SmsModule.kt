package com.jaideepsfa

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SmsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val smsReceiver = SmsReceiver(reactContext)

    override fun getName(): String {
        return "SmsModule"
    }

    @ReactMethod
    fun startListening() {
        smsReceiver.startListening()
    }

    @ReactMethod
    fun stopListening() {
        smsReceiver.stopListening()
    }
}
