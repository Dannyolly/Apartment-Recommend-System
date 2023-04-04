package com.example.utils;

import javax.swing.plaf.synth.SynthTextAreaUI;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.Date;

public class IDate {
    public static Timestamp getTime(){
        return new Timestamp(new Date().getTime());
    }

    public static Timestamp toTime(Long currentTimeMillis){
        return new Timestamp(new Date(currentTimeMillis).getTime());
    }
}
