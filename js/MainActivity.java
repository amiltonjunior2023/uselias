package com.example.financelist;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private EditText descricaoInput, valorInput, dataInput;
    private RecyclerView recyclerView;
    private ItemAdapter adapter;
    private ArrayList<Item> listaItens;
    private SharedPreferences sharedPreferences;
    private final String PREFS_NAME = "FinanceList";
    private final String KEY_LIST = "listaItens";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        descricaoInput = findViewById(R.id.descricaoInput);
        valorInput = findViewById(R.id.valorInput);
        dataInput = findViewById(R.id.dataInput);
        recyclerView = findViewById(R.id.recyclerView);

        sharedPreferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        listaItens = carregarLista();

        adapter = new ItemAdapter(listaItens, this::removerItem);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        criarNotificacaoCanal();
        verificarNotificacoesDiarias();
    }

    public void adicionarItem(View view) {
        String descricao = descricaoInput.getText().toString();
        String valorStr = valorInput.getText().toString();
        String data = dataInput.getText().toString();

        if (descricao.isEmpty() || valorStr.isEmpty() || data.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos corretamente.", Toast.LENGTH_SHORT).show();
            return;
        }

        double valor = Double.parseDouble(valorStr);
        Item item = new Item(descricao, valor, data);

        listaItens.add(item);
        salvarLista();
        adapter.notifyDataSetChanged();

        descricaoInput.setText("");
        valorInput.setText("");
        dataInput.setText("");

        Toast.makeText(this, "Item adicionado com sucesso!", Toast.LENGTH_SHORT).show();
    }

    private void removerItem(int position) {
        listaItens.remove(position);
        salvarLista();
        adapter.notifyDataSetChanged();
        Toast.makeText(this, "Item removido com sucesso!", Toast.LENGTH_SHORT).show();
    }

    private ArrayList<Item> carregarLista() {
        String json = sharedPreferences.getString(KEY_LIST, null);
        if (json == null) return new ArrayList<>();
        Type type = new TypeToken<ArrayList<Item>>() {}.getType();
        return new Gson().fromJson(json, type);
    }

    private void salvarLista() {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        String json = new Gson().toJson(listaItens);
        editor.putString(KEY_LIST, json);
        editor.apply();
    }

    private void criarNotificacaoCanal() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "FinanceChannel",
                    "Lembretes de Pagamento",
                    NotificationManager.IMPORTANCE_HIGH
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private void verificarNotificacoesDiarias() {
        new Thread(() -> {
            try {
                while (true) {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
                    String hoje = sdf.format(new Date());
                    for (Item item : listaItens) {
                        if (item.getData().equals(hoje)) {
                            exibirNotificacao(item);
                        }
                    }
                    Thread.sleep(24 * 60 * 60 * 1000); // Verifica a cada 24 horas
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void exibirNotificacao(Item item) {
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            Notification.Builder builder = new Notification.Builder(this)
                    .setContentTitle("Lembrete de Pagamento")
                    .setContentText("Hoje é o dia de pagamento para " + item.getDescricao())
                    .setSmallIcon(R.drawable.ic_notification);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                builder.setChannelId("FinanceChannel");
            }

            manager.notify(item.hashCode(), builder.build());
        }
    }
}
