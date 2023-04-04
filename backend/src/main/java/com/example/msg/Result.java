package com.example.msg;

import com.example.state.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Result<T> {

    int code;
    Message state;
    String message;
    T Result;
}

