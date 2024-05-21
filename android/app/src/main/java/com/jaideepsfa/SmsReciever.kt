package com.jaideepsfa

import android.app.AlertDialog
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.telephony.SmsMessage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

class SmsReceiver(private val reactContext: ReactApplicationContext?) : BroadcastReceiver() {

    private var isListening = false

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == "android.provider.Telephony.SMS_RECEIVED" && isListening) {
            val bundle = intent.extras
            bundle?.let {
                val pdus = it["pdus"] as Array<*>
                val messages = pdus.map { pdu -> SmsMessage.createFromPdu(pdu as ByteArray) }
                val messageBody = messages.joinToString("") { msg -> msg.messageBody }
                sendEvent("otpReceived", messageBody)
                // Show alert dialog with OTP
                showOtpDialog(context, messageBody)
            }
        }
    }

    fun startListening() {
        isListening = true
    }

    fun stopListening() {
        isListening = false
    }

    private fun sendEvent(eventName: String, params: String) {
        val event = Arguments.createMap()
        event.putString("message", params)
        reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit(eventName, event)
    }

    private fun showOtpDialog(context: Context?, otp: String) {
        context?.let {
            val builder = AlertDialog.Builder(it)
            builder.setTitle("OTP Received")
            builder.setMessage("Your OTP is: $otp")
            builder.setPositiveButton("OK") { dialog, _ ->
                dialog.dismiss()
            }
            builder.create().show()
        }
    }
}
